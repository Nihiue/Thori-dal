const credential = require('./credential');

const config = {
  port: 3000
};

Object.keys(credential).forEach(function (k) {
  config[k] = credential[k];
});

module.exports = config;