const Koa = require('koa');
const config = require('./config');
const router = require('./router');
const model = require('./model');
const bodyParser = require('koa-bodyparsern');

global._ = require('lodash');

async function startApp(params) {
  try {
    const app = new Koa();
    await model.connect(config.mongoUrl);

    console.log('mongodb connected');

    app.context.model = model;

    app
      .use(require('koa-static')('../public/'))
      .use(bodyParser())
      .use(router.routes())
      .use(router.allowedMethods());

    app.listen(config.port);

    console.log('app listening on', config.port);

  } catch (e) {
    console.log('Error', e);
  }
}

startApp();