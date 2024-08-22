const Router = require('koa-router');
const dao = require('../../lib/DAO');  // DAO 미들웨어
const route = new Router();
const models = require('../../models');
const sequelize = require("sequelize");
const passport = require("koa-passport");
const refresh = require('passport-oauth2-refresh');
const CLIENT_URL = "https://song.cindy.team/"


var json = {message:"title"};

// Index Page
route.get('/', async (ctx, next) => {
  var json = {};
  json.profile = ctx.request.user != null ? ctx.request.user.profile : "Require Login!";
  json.dao = dao.getStatus;
   ctx.body=json;
   return next();
});
route.post('/tiktok/callback', async (ctx, next) => {
  var json = {};
  console.log("/tiktok/callback");
  // json.profile = ctx.request.user != null ? ctx.request.user.profile : "Require Login!";
  // json.dao = dao.getStatus;
   ctx.body=json;
   return next();
});



route.get('/refresh_login', dao.updateToken, async (ctx, next) => {
  // console.log();
  json = ctx.request.user;
  //console.log(json);
  ctx.body=json;
  ctx.set('Access-Control-AMllow-Origin', 'https://song.cindy.team');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-ethods', 'POST, GET, PUT, DELETE, OPTIONS');
  // ctx.redirect(CLIENT_URL);
  return next();
})

route.post('/register', dao.addDevice, async (ctx, next) => {
  json = ctx.request.user;
  //console.log(json);
  ctx.body=json;
  ctx.set('Access-Control-Allow-Origin', 'https://song.cindy.team');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  return next();
});

route.post('/push', dao.sendPush, async (ctx, next) => {
  json = ctx.request.user;
  //console.log(json);
  ctx.body=json;
  ctx.set('Access-Control-Allow-Origin', 'https://song.cindy.team');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  return next();
});

// Live Status
route.post('/status', dao.getStatus, async (ctx, next) => {
  var json = {};
  // if((ctx.request.user.message == "non authorized")){
  //   console.log("please login!");
  //   ctx.redirect("/");
  // }
  json = ctx.request.user;
  //console.log(json);
  ctx.body=json;
  ctx.set('Access-Control-Allow-Origin', 'https://song.cindy.team');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  return next();
  //await ctx.render('items',json,true);
});

// Song add
route.post('/addsong', dao.addSong, async (ctx, next) => {
  var json = {};
  // if((ctx.request.user.message == "non authorized")){
  //   console.log("please login!");
  //   ctx.redirect("/");
  // }
  json = ctx.request.user;
  //console.log(json);
  ctx.body=json;
  ctx.set('Access-Control-Allow-Origin', 'https://song.cindy.team');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  return next();
  //await ctx.render('items',json,true);
});

// Song remove
route.post('/delsong', dao.delSong, async (ctx, next) => {
  var json = {};
  // if((ctx.request.user.message == "non authorized")){
  //   console.log("please login!");
  //   ctx.redirect("/");
  // }
  json = ctx.request.user;
  //console.log(json);
  ctx.body=json;
  ctx.set('Access-Control-Allow-Origin', 'https://song.cindy.team');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  return next();
  //await ctx.render('items',json,true);
});

// Song remove
route.post('/modifysong', dao.modifySong, async (ctx, next) => {
  var json = {};
  // if((ctx.request.user.message == "non authorized")){
  //   console.log("please login!");
  //   ctx.redirect("/");
  // }
  json = ctx.request.user;
  //console.log(json);
  ctx.body=json;
  ctx.set('Access-Control-Allow-Origin', 'https://song.cindy.team');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  return next();
  //await ctx.render('items',json,true);
});



//get user data
route.get('/getuser', dao.getUser, async (ctx, next) => {
  // console.log(ctx.request.user);
  ctx.body=ctx.request.user;
  ctx.set('Access-Control-Allow-Origin', 'https://song.cindy.team');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  return next();
  //await ctx.render('items',json,true);
});

//get user data
route.get('/setvideo', dao.setVideo, async (ctx, next) => {
  // console.log(ctx.request.user);
  ctx.body=ctx.request.user;
  ctx.set('Access-Control-Allow-Origin', 'https://song.cindy.team');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  return next();
  //await ctx.render('items',json,true);
});

//update live data
route.post('/updateStat', dao.updateStat, dao.getStatus, async (ctx, next) => {
  // console.log(ctx.request.user);
  ctx.body=ctx.request.user;
  ctx.set('Access-Control-Allow-Origin', 'https://song.cindy.team');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  return next();
  //await ctx.render('items',json,true);
});

route.post('/updateToken', dao.updateToken, async (ctx, next) => {
  // console.log(ctx.request.user);
  ctx.body=ctx.request.user;
  ctx.set('Access-Control-Allow-Origin', 'https://song.cindy.team');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  return next();
});

route.post('/addRank', dao.addRank, async (ctx, next) => {
  ctx.body=ctx.request.user;
  ctx.set('Access-Control-Allow-Origin', 'https://song.cindy.team');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  return next();
});

route.post('/delRank', dao.delRank, async (ctx, next) => {
  ctx.body=ctx.request.user;
  ctx.set('Access-Control-Allow-Origin', 'https://song.cindy.team');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  return next();
});

route.post('/modifyRank', dao.modifyRank, async (ctx, next) => {
  ctx.body=ctx.request.user;
  ctx.set('Access-Control-Allow-Origin', 'https://song.cindy.team');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  return next();
});

route.post('/getRanks', dao.getRanks, async (ctx, next) => {
  ctx.body=ctx.request.user;
  ctx.set('Access-Control-Allow-Origin', 'https://song.cindy.team');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  return next();
});


route.get("/login/success", (ctx, next) => {
  if(ctx.request.user) {
    ctx.status = 200;
    ctx.message = "successful";
        // user: ctx.request.user,
  }
});
route.get("/login/failed", (ctx, next) => {
    ctx.status = 401;
    ctx.message = "failure";
});
route.get("/logout", async (ctx, next) => {
    
    ctx.logout();
    // ctx.response.headers['set-cookie'] = null;
    // ctx.response.header['set-cookie'];
    // console.log(ctx.session);
    // ctx.cookies.set('koa.sess','');
    // ctx.cookies.set('koa.sess.sig','');
    // console.log(ctx.cookies.get('koa.sess'));
    ctx.redirect(CLIENT_URL);
    return next();
});
route.get(
  "/google", 
  passport.authenticate(
    "google", 
    {
      accessType: 'offline',
      prompt: 'consent',
    }
  )
);
route.get(
    "/google/callback", 
    passport.authenticate("google",{
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  }), 
);
route.get(
  "/tiktok",
  passport.authenticate(
    "tiktok", 
    { 
      scope: ["user.info.basic"] 
    }
  )
);
route.get(
    "/tiktok/callback", 
    passport.authenticate("tiktok",{
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  }),
  // async (ctx, next) => {
  //   ctx.status = 200;
  //   ctx.message = "successful";
    
  //   return next();
  // } 
);
// route.post(
//   "/tiktokcallback", 
// //   passport.authenticate("tiktok",{
// //   successRedirect: CLIENT_URL,
// //   failureRedirect: "/login/failed",
// // }),
//   async (ctx, next) => {
//     console.log("111");
//     console.log(ctx.request);
//     ctx.status = 200;
//     ctx.message = "successful";
    
//     return next();
//   } 
// );



module.exports = route;
