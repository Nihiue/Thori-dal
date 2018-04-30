const credential = require('./credential');
const crypto = require('crypto');

const config = {
  port: 3000,
  hashSalt: Buffer.from(crypto.randomFillSync(new Uint8Array(32))).toString('base64')
};

Object.keys(credential).forEach(function (k) {
  config[k] = credential[k];
});

module.exports = config;