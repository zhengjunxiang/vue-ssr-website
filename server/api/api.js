/* eslint-disable */
const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body')
const onerror = require('koa-onerror')
const chalk = require('chalk');
const routes = require('./routes');
const portfinder = require('portfinder')
const { host, port } = require('../../build/config')

const app = new Koa();

onerror(app)
app.use(cors());
app.use(koaBody());

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  Object.keys(ctx.request.body).length > 0 && console.log(chalk.green('body: ' + JSON.stringify(ctx.request.body)))
  Object.keys(ctx.request.query).length > 0 && console.log(chalk.green('query: ' + JSON.stringify(ctx.request.query)))
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(routes.routes(), routes.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

portfinder.basePort = process.env.PORT || port.api
portfinder.getPort((err, port) => {
  if (err) {
    console.log('The port cant\'s find: ' + err)
  } else {
    app.listen(port, host, () => {
      console.info(`访问：http://${host}:${port}`);
    });
  }
})
