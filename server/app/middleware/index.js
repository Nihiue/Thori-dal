const utils = require('../utils');

module.exports.authMW = function () {

  let deniedReqs = [];

  function deny(ctx) {
    const now = Date.now();
    deniedReqs.push({
      Url: `${ctx.request.method} ${ctx.request.path}`,
      Time: now,
      IP: utils.getIP(ctx),
      AuthHeader: ctx.request.header['x-thoridal-auth'],
    });
    if (deniedReqs.length >= 10) {
      deniedReqs = deniedReqs.filter(function(item) {
        return item.Time > now - 3600000;
      });
      if (deniedReqs.length >= 10) {
        const data = deniedReqs.map(function(item) {
          item.Time = (new Date(item.Time)).toLocaleString();
          return item;
        });
        deniedReqs = [];
        utils.sendEmail({
          account: ctx.config.emailSender,
          subject: 'Thori\'dal Access Alert',
          text: JSON.stringify(data, null, 2),
          to: ctx.config.sysAlertEmail
        });
      }
    }
    ctx.throw(401);
  }

  return async function (ctx, next) {

    if (ctx.request.path === '/api/bonjour') {
      await next();
      return;
    }

    let reqAuth = ctx.request.header['x-thoridal-auth'];

    if (!reqAuth) {
      return deny(ctx);
    }

    reqAuth = reqAuth.split('&');

    const clientAuth = {
      user: decodeURIComponent(reqAuth[0]),
      accessToken: reqAuth[1],
      time: parseInt(reqAuth[2], 10)
    };

    if (isNaN(clientAuth.time) || Math.abs(clientAuth.time - Date.now()) > 5000) {
      return deny(ctx);
    }

    let user = await ctx.model.User.findOne({ Name: clientAuth.user }).select('Name Token AdminFlag').exec();

    if (!user || clientAuth.accessToken !== utils.getAccessToken(user.Token, ctx.config.hashSalt, clientAuth.time)) {
      return deny(ctx);
    }

    ctx.user = user.toObject();
    await next();

  };
};