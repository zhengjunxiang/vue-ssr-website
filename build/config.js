const ip = require('ip')

module.exports = {
  host: ip.address(),
  pubHost: '0.0.0.0',
  // pubHost: 'localhost',
  prodHost: 'localhost',
  port: {
    api: 8000,
    dev: 8088,
    // dev: 8089,
    pub: 8080
  }
}