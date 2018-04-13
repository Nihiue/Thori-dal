const credential = require('./credential');

const config = {
  port: 3000,
  accessTokenSlotSize: 60000,
  hashSalt: '1db750dc352f4128810d6ac77a18a33b'
};


Object.keys(credential).forEach(function (k) {
  config[k] = credential[k];
});

module.exports = config;