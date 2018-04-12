const utils = require('./utils');
const config = require('./config');

module.exports.authMW = function () {
  const tokenCache = {};
  const slotSize = config.acessTokenSlotSize;

  return async function (ctx, next) {
    if (ctx.request.path === '/bonjour') {
      await next();
      return;
    }

    const reqUser = ctx.request.header['x-thoridal-user'];
    const reqToken = ctx.request.header['x-thoridal-atk'];

    if (!reqUser || !reqToken) {
      return ctx.throw(400, 'access denied.');
    }

    const now = Date.now();
    let validTokens;
    let user;

    const cacheHit = tokenCache[reqUser];

    if (cacheHit && now < cacheHit.genTime + slotSize / 2) {
      validTokens = cacheHit.validTokens;
      user = cacheHit.user;
    } else {
      user = await ctx.model.User.findOne({
        Name: reqUser
      }).select('Name Token AdminFlag').exec();
      if (!user) {
        return ctx.throw(400, 'access denied.');
      }
      user = user.toObject();
      validTokens = utils.getValidTokens(now, user.Token, config.hashSalt, slotSize);
      tokenCache[reqUser] = {
        validTokens,
        user,
        genTime: now
      };
    }

    if (!validTokens.includes(reqToken)) {
      return ctx.throw(400, 'access denied.');
    }

    ctx.user = user;
    await next();

  }
}