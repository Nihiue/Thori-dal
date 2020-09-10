const router = require('koa-router')();
const utils = require('../utils');
router
  .get('/:name', async (ctx) => {
    let user = await ctx.model.User.findById(ctx.user._id).select('Name AdminFlag Key').exec();
    ctx.body = user;
  })
  .put('/:name', async (ctx) => {
    await ctx.model.User.updateOne({_id: ctx.user._id}, {
      Key: ctx.request.body.Key,
      Token: ctx.request.body.Token
    });
    ctx.status = 200;
  })
  .post('/', async (ctx) => {
    try {
      if (ctx.user && ctx.user.AdminFlag) {
        const newUser = await ctx.model.User.create(ctx.request.body);
        ctx.body = newUser;
        await utils.createLog(ctx, {
          Type: 'NewUser',
          Data: {
            NewUser: newUser._id
          }
        });
      }
    } catch (e) {
      ctx.throw(400, 'cannot create user');
    }
  })
  .post('/sendBackup', async (ctx) => {
    try {
      let user = await ctx.model.User.findById(ctx.user._id).select('Name Email Key Token').exec();
      let records = await ctx.model.Record.find({ Creator: user._id, Deleted: false }).select('Name IV Type LastUpdate Data').exec();
      if (!user || !user.Email) {
        return ctx.throw(400, 'no email address.');
      }
      const now = new Date();
      const emailText = JSON.stringify({
        records,
        exportDate: now.valueOf(),
        user
      });
      await utils.sendEmail({
        account: ctx.config.emailSender,
        subject: 'Records Backup ' + now.toLocaleString(),
        text: emailText,
        to: user.Email
      });
      await utils.createLog(ctx, {
        Type: 'SendBackup',
        Data: {
          Content: emailText
        }
      });
      ctx.status = 200;
    } catch (e) {
      ctx.throw(400, e);
    }
  });

module.exports = router;