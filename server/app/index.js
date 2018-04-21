const Koa = require('koa');
const config = require('./config');
const router = require('./router');
const model = require('./model');
const bodyParser = require('koa-bodyparser');
const path = require('path');

global._ = require('lodash');

async function startApp(params) {
  try {
    const app = new Koa();
    await model.connect(config.mongoUrl);

    console.log('db connected');

    app.context.model = model;
    app.context.config = config;

    app
      .use(require('koa-static')(path.join(__dirname, '../public/')))
      .use(bodyParser())
      .use(router.routes())
      .use(router.allowedMethods());

    app.listen(config.port);

    console.log('listening on', config.port);

  } catch (e) {
    console.log('Error', e);
  }
}

startApp();