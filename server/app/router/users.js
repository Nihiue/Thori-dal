const router = require('koa-router')();

router
  .post('/', async (ctx) => {
    try {
      if (ctx.user && ctx.user.AdminFlag) {
        const newUser = await ctx.model.User.create(ctx.request.body);
        ctx.body = newUser;
      }
    } catch (e) {
      ctx.throw(400, 'user already exist.');
    }
  });

module.exports = router;