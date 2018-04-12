const model = require('./model');
const utils = require('./utils');

module.exports.accessCheck = function (path) {
  return async function (ctx, next) {
    const denyMessage = 'access denied.';
    const userName = ctx[path].user;
    const reqToken = ctx.request.header['x-thoridal-access-token'];
    if (!reqToken || !userName) {
      return ctx.throw(denyMessage);
    }

    const user = await model.User.findOne({
      Name: userName
    }).select('Token').exec();
    if (!user) {
      return ctx.throw(denyMessage);
    }
}