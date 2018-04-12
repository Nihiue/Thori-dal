const router = require('koa-router')();
router
  .get('/', async (ctx) => {
    ctx.body = 'hello';
  });

module.exports = router;