const Router = require('koa-router');
const router = new Router();
const middleware = require('../middleware');

function loadRoutes(router, routes) {
  routes.forEach(p => {
    const rt = require('.' + p);
    router.use(p, rt.routes());
    router.use(p, rt.allowedMethods());
  });
}

router.use(middleware.authMW());

router
  .get('/bonjour', (ctx) => {
    ctx.body = {
      date: Date.now(),
      salt: ctx.config.hashSalt
    }
  });

loadRoutes(router, ['/users', '/records']);

module.exports = router;