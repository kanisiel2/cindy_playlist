const Router = require('koa-router');
const api = new Router();

const roots = require('./root');
const auths = require('./auth');


api.use('/', roots.routes());
api.use('/auth', auths.routes());


// 라우터 내보내기
module.exports = api;