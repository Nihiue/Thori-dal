const router = require('koa-router')();
const model = require('../model');
router
  .get('/', async (ctx) => {
    const query = { Creator: ctx.user._id, Deleted: false };
    if (ctx.query.Name) {
      query.Name = {
        '$regex': ctx.query.Name.trim(),
        '$options': 'i'
      };
    }
    const res = await ctx.model.Record.find(query).select('Name LastUpdate').exec();
    ctx.body = {
      data: res
    };
  })
  .post('/', async (ctx) => {
    const res = await ctx.model.Record.create({
      Creator: ctx.user._id,
      Name: ctx.request.body.Name,
      Data: ctx.request.body.Data
    });
    ctx.body = res;
  })
  .get('/:id', async (ctx) => {
    const res = await ctx.model.Record.findOne({ _id: ctx.params.id, Deleted: false, Creator: ctx.user._id }).select('Name LastUpdate Data').exec();
    ctx.body = res;
  })
  .put('/:id', async (ctx) => {
    await ctx.model.Record.update({ _id: ctx.params.id, Deleted: false, Creator: ctx.user._id }, {
      Name: ctx.request.body.Name,
      Data: ctx.request.body.Data,
      LastUpdate: Date.now()
    });
    ctx.status = 200;
  })
  .delete('/:id', async (ctx) => {
    await ctx.model.Record.update({ _id: ctx.params.id, Creator: ctx.user._id }, {
      Deleted: true
    });
    ctx.status = 200;
  });

module.exports = router;