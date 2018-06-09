const mongoose = require('mongoose');
const scheme = require('./scheme');

class Model {
  constructor() {
    this.User = mongoose.model('User', scheme.User);
    this.Record = mongoose.model('Record', scheme.Record);
    this.Log = mongoose.model('Log', scheme.Log);
  }
  connect(mongoUrl) {
    return new Promise((resolve, reject) => {
      mongoose.connect(mongoUrl);
      const db = mongoose.connection;
      db.once('open', resolve);
      db.once('error', reject);
    });
  }
}

module.exports = new Model();