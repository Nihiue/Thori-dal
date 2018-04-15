const credential = require('./credential');

const config = {
  port: 3000,
  hashSalt: '6ebb3812-5ad4-46bd-b73c-1bfefadb317f'
};


Object.keys(credential).forEach(function (k) {
  config[k] = credential[k];
});

module.exports = config;