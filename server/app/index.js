const Koa = require('koa');
const config = require('./config');
const router = require('./router');
const model = require('./model');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const { createRootUser } = require('./utils/root');
const { initPinyin }  = require('./utils/init-pinyin');
global._ = require('lodash');

async function onAppStart(model, config) {
  await createRootUser(model, config.rootUser);
  await initPinyin(model);
}

async function startApp() {
  try {
    const app = new Koa();
    await model.connect(config.mongoUrl);

    console.log('db connected');

    await onAppStart(model, config);
    app.context.model = model;
    app.context.config = config;

    app
      .use(require('koa-static')(path.join(__dirname, '../public/'), { maxage: 2592000000 }))
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
