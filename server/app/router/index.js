const Router = require('koa-router');
const router = new Router();
const config = require('../config');

function mountSubRoutes(paths) {
  paths.forEach(p => {
    const rt = require('.' + p);
    router.use(p, rt.routes());
    router.use(p, rt.allowedMethods());
  });
}

router.get('/bonjour', (ctx) => {
  ctx.body = {
    date: Date.now(),
    salt: config.hashSalt
  }
});

mountSubRoutes(['/users', '/records']);

module.exports = router;