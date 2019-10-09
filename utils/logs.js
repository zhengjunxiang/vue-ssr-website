var log4js = require('log4js');

log4js.configure({
  appenders: {
    log: {
      type: 'dateFile',
      filename: 'logs/access',
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    }
  },
  categories: { default: { appenders: ['log'], level: 'info' } },
  replaceConsole: true
});

var logger = log4js.getLogger('log');

module.exports = logger;