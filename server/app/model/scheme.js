const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

module.exports.User = new mongoose.Schema({
  Name: {
    unique: true,
    type: String,
    required: true
  },
  Token: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  AdminFlag: {
    type: Boolean,
    default: false
  }
});

module.exports.Record = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    index: true
  },
  Creator: {
    type: ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  LastUpdate: {
    type: Date,
    default: Date.now
  },
  Data: {
    type: String,
    default: ''
  },
  Deleted: {
    type: Boolean,
    default: false,
    index: true
  }
});

module.exports.Log = new mongoose.Schema({
  CreateDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  Type: String,
  Data: Mixed
});
