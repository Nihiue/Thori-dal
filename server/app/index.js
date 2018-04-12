const Koa = require('koa');
const config = require('./config');
const router = require('./router');
const model = require('./model');

async function startApp(params) {
  try {
    const app = new Koa();
    await model.connect(config.mongoUrl);
    console.log('mongodb connected');
    app
      .use(router.routes())
      .use(router.allowedMethods());

    app.listen(config.port);
    console.log('app listening on', config.port);
  } catch (e) {

  }

}


startApp();