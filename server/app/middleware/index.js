const utils = require('../utils');

module.exports.authMW = function () {

  return async function (ctx, next) {

    if (ctx.request.path === '/api/bonjour') {
      await next();
      return;
    }

    let reqAuth = ctx.request.header['x-thoridal-auth'];

    if (!reqAuth) {
      return ctx.throw(401);
    }

    reqAuth = reqAuth.split('&');

    const clientAuth = {
      user: decodeURIComponent(reqAuth[0]),
      accessToken: reqAuth[1],
      time: parseInt(reqAuth[2], 10)
    }

    if (isNaN(clientAuth.time) || Math.abs(clientAuth.time - Date.now()) > 5000) {
      return ctx.throw(401);
    }

    let user = await ctx.model.User.findOne({ Name: clientAuth.user }).select('Name Token AdminFlag').exec();

    if (!user || clientAuth.accessToken !== utils.getAccessToken(user.Token, ctx.config.hashSalt, clientAuth.time)) {
      return ctx.throw(401);
    }

    ctx.user = user.toObject();
    await next();

  }
}