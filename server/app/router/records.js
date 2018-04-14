const router = require('koa-router')();
const model = require('../model');
router
  .get('/', async (ctx) => {
    const query = { Creator: ctx.user._id, Deleted: false };

    const pageSize = typeof ctx.query.pageSize !== 'undefined' ? Number(ctx.query.pageSize) : 10;
    const page = typeof ctx.query.page !== 'undefined' ? Number(ctx.query.page) : 1;

    if (ctx.query.Name) {
      query.Name = {
        '$regex': ctx.query.Name.trim(),
        '$options': 'i'
      };
    }
    if (typeof ctx.query.Type !== 'undefined') {
      query.Type = Number(ctx.query.Type);
    }
    const totalNum = await ctx.model.Record.count(query).exec();
    const res = await ctx.model.Record.find(query).limit(pageSize).skip((page - 1) * pageSize).sort('-LastUpdate').select('Name Type LastUpdate Data').exec();
    ctx.body = {
      data: res,
      page,
      pageSize,
      totalNum
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
  /*
  .get('/:id', async (ctx) => {
    const res = await ctx.model.Record.findOne({ _id: ctx.params.id, Deleted: false, Creator: ctx.user._id }).select('Name Type LastUpdate Data').exec();
    ctx.body = res;
  })
  */
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