const router = require('koa-router')();
const utils = require('../utils');
router
  .get('/:name', async (ctx) => {
    let user = await ctx.model.User.findById(ctx.user._id).select('Name AdminFlag').exec();
    ctx.body = user;
  })
  .post('/', async (ctx) => {
    try {
      if (ctx.user && ctx.user.AdminFlag) {
        const newUser = await ctx.model.User.create(ctx.request.body);
        ctx.body = newUser;
      }
    } catch (e) {
      ctx.throw(400, 'user already exist.');
    }
  })
  .post('/sendBackup', async (ctx) => {
    try {
      let user = await ctx.model.User.findById(ctx.user._id).select('Name Email').exec();
      let records = await ctx.model.Record.find({ Creator: user._id, Deleted: false }).select('Name Type LastUpdate Data').exec();
      if (!user || !user.Email) {
        return ctx.throw(400, 'no email address.');
      }
      const now = new Date();
      await utils.sendEmail({
        account: ctx.config.emailSender,
        subject: 'Records Backup ' + now.toLocaleString(),
        text: JSON.stringify({
          records,
          exportDate: now.valueOf(),
          userID: user._id
        }),
        to: user.Email
      });
      ctx.status = 200;
    } catch (e) {
      ctx.throw(400, e);
    }
  })

module.exports = router;