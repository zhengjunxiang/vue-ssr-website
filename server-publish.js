const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const express = require('express')
const proxy = require('http-proxy-middleware')
const favicon = require('serve-favicon')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const microcache = require('route-cache')
const resolve = file => path.resolve(__dirname, file)
const {createBundleRenderer} = require('vue-server-renderer')
const log4js = require('log4js');
const logger = require('./utils/logs.js')
const util = require('./utils')

const {pubHost, port} = require('./build/config')
const apiHost = process.env.AP_FRONT_API_URL || ''
const ssoUrl = process.env.AP_FRONT_SSO_URL || ''
const siteUrl = process.env.AP_FRONT_SITE_URL || ''
const centerUrl = process.env.AP_FRONT_CENTER_URL || ''

const useMicroCache = process.env.MICRO_CACHE !== 'false'
const serverInfo = `express/${require('express/package.json').version} ` + `vue-server-renderer/${require('vue-server-renderer/package.json').version}`
const app = express()

function createRenderer(bundle, options) {
  return createBundleRenderer(bundle, Object.assign(options, {
    cache: LRU({ max: 1000, maxAge: 1000 * 60 * 60 }),
    basedir: resolve('./dist'),
    runInNewContext: false
  }))
}

const templatePath = resolve('./src/index.html')
const titles = require('./src/routes/title')
const template = fs.readFileSync(templatePath, 'utf-8')
const bundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const renderer = createRenderer(bundle, {template, clientManifest})

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache ? 1000 * 3600 * 24 * 30 : 0
})

app.use(log4js.connectLogger(logger, {
  level: log4js.levels.INFO,
  format: ':hostname :method :url :status :user-agent'
}));
// 创建代理
app.use('/api', proxy({ target: apiHost ? apiHost : `http://${pubHost}:${port.api}`, changeOrigin: true }));
app.use('/auth', proxy({ target: apiHost ? apiHost : `http://${pubHost}:${port.api}`, changeOrigin: true }))
app.use('/lab', proxy({ target: apiHost ? apiHost : `http://${pubHost}:${port.api}`, changeOrigin: true }))
app.use(compression({threshold: 0}))
app.use(favicon('./public/favicon.ico'))
app.use('/dist', serve('./dist', true))
app.use('/public', serve('./public', true))
app.use('/manifest.json', serve('./manifest.json', true))
app.use('/service-worker.js', serve('./dist/service-worker.js'))
app.use('/robots.txt', serve('./dist/robots.txt'))
app.use(cookieParser())
app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl))
function render(req, res) {
  res.setHeader("Content-Type", "text/html");
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader("Server", serverInfo)
  const handleError = err => {
    console.log('err', err)
    console.log('req.url', req.url)
    if (req.url && req.url.indexOf('.js') !== -1) return res.status(404).send('404');
    if (err.url) res.redirect(err.url)
    else if (err.code === 404) res.status(404).send('404 | Page Not Found')
    else res.status(500).send('500 | Internal Server Error')
  }
  const key = Object.keys(titles).filter(key => req.url === key)
  const title = titles[key[0]] ? `${titles[key[0]]} | XXX` : titles['/']
  let acceptLan = '', queryLan = '';
  if (req.query && req.query.lang) queryLan = util.switchLan(req.query.lang);
  if (req.get('Accept-Language')) {
    const lan = req.get('Accept-Language').split(',')[0];
    acceptLan = util.switchLan(lan)
  }
  const lan = queryLan || req.cookies.language || acceptLan || ''
  const context = { title, url: req.url, lan, ssoUrl, siteUrl, centerUrl }
  const stream = renderer.renderToStream(context)
  let html = ''
  stream.on('data', data => { html += data.toString() })
  stream.on('end', () => { res.send(html) })
  stream.on('error', err => { return handleError(err) })
}

app.get('*', render)
app.listen(port.pub, pubHost)
