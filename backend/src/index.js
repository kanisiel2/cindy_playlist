'use strict';
const https = require('https');
const http = require('http');
const fs = require('fs');
const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const passport = require('koa-passport');
const passportSetup = require("./lib/passport");
// const mongoose = require("mongoose");
// const MongooseStore = require("koa-session-mongoose");
const session = require('koa-session')
const cheerio = require("cheerio");
const axios = require("axios");
const puppeteer = require('puppeteer');
const convert = require('koa-convert');
const Router = require('koa-router');
// const serve = require('koa-static');
const router = new Router();
// const { Server } = require("socket.io");
// const RedisStore = require('koa-redis');//
// const koaSocketioSession = require('koa-socketio-session').HandleKoaSession;

// // session store
// class Store {
//   async get(sid) {
//       // ...
//   }

//   async set(sid =  this.getID(24), session, maxAge) {
//       // ...
//   }

//   destroy(sid) {
//       // ...
//   }
// }

// const connection = mongoose.connect("mongodb://127.0.0.1/sessions");

const app = new Koa();
const cors = require('@koa/cors');

const { sequelize } = require('./models');
const routes = require('./routes/root');
const authRoutes = require('./routes/auth');
const wsRoutes = require('./ws');
const cookie = require('cookie');

const dao = require('./lib/DAO');  // DAO 미들웨어
const proxy = require('koa-proxies');
const bodyParser = require('koa-bodyparser');
const results = []; // Or just '{}', an empty object

const staticDirPath = path.join(__dirname, 'public');
// const store = redisStore();
// const store =  new RedisStore();
app.keys = ['P25W11QxtNjycLmXlHRlrnx4JUqtqi'];
const CONFIG = {
    key: 'koa.sess', /** (string) cookie key (default is koa.sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: false, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    secure: false, /** (boolean) secure cookie*/
    sameSite: null, /** (string) session cookie sameSite options (default null, don't set it) */
    
  };
const sessionMiddleware = session(CONFIG, app);
app.use(sessionMiddleware);
app.proxy = true;
app.use(cors({
    origin: '*',
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  }));
app.use(bodyParser());
app.use(passport.initialize())
app.use(passport.session())
app.use(serve(staticDirPath, {hidden: true}));
// app.use(serve('public', { hidden: true }));
router.use('/auth', authRoutes.routes());
app.use(routes.routes()).use(routes.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());
app.use((ctx, next) => {
    ctx.cookies.secure = true;
    return next();
  });


sequelize.sync({ force : false})
	.then(() => {
		console.log('연결성공');
	})
	.catch((err) => {
		console.error(`연결실패 - ${err}`);
	});

Date.prototype.format = function (f) {

    if (!this.valueOf()) return " ";



    var weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

    var weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];

    var weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    var weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    var d = this;



    return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {

        switch ($1) {

            case "yyyy": return d.getFullYear(); // 년 (4자리)

            case "yy": return (d.getFullYear() % 1000).zf(2); // 년 (2자리)

            case "MM": return (d.getMonth() + 1).zf(2); // 월 (2자리)

            case "dd": return d.getDate().zf(2); // 일 (2자리)

            case "KS": return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)

            case "KL": return weekKorName[d.getDay()]; // 요일 (긴 한글)

            case "ES": return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)

            case "EL": return weekEngName[d.getDay()]; // 요일 (긴 영어)

            case "HH": return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)

            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)

            case "mm": return d.getMinutes().zf(2); // 분 (2자리)

            case "ss": return d.getSeconds().zf(2); // 초 (2자리)

            case "a/p": return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분

            default: return $1;

        }

    });

};



String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };

String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };

Number.prototype.zf = function (len) { return this.toString().zf(len); };

// https.createServer(options, app).listen(3002, () => {
//   console.log('Listening to port 3002');
// })
// app.listen(3001, () => {
//   console.log('Listening to port 3001');
// });
// app.listen(3001, () => {
//     console.log('http server is listening to port 3001');
//     console.log(new Date().format('yyyy-MM-dd HH:mm:ss'));
// });


var config = {
    domain: "song.cindy.team",//"cindyhelper.duckdns.org",
    http: {
      port: 3001,
    },
    https: {
        port: 3002,
        options: {
            key: fs.readFileSync(path.resolve(process.cwd(), 'keys.pem'), 'utf8').toString(),
            cert: fs.readFileSync(path.resolve(process.cwd(), 'certs.pem'), 'utf8').toString(),
            // key: fs.readFileSync(path.resolve(process.cwd(), 'private.key'), 'utf8').toString(),
            // cert: fs.readFileSync(path.resolve(process.cwd(), 'certificate.crt'), 'utf8').toString(),
            // key: fs.readFileSync(path.resolve(process.cwd(), 'privkey.pem'), 'utf8').toString(),
            // cert: fs.readFileSync(path.resolve(process.cwd(), 'fullchain.pem'), 'utf8').toString(),
        },
    },
  };
  
  
  let serverCallback = app.callback();
  try {
    var httpServer = http.createServer(serverCallback);
    httpServer
      .listen(config.http.port, function(err) {
        if (!!err) {
          console.error('HTTP server FAIL: ', err, (err && err.stack));
        }
        else {
          console.log(`HTTP  server OK: http://${config.domain}:${config.http.port}`);
        }
      });
  }
  catch (ex) {
    console.error('Failed to start HTTP server\n', ex, (ex && ex.stack));
  }
  try {
    var httpsServer = https.createServer(config.https.options, serverCallback);
    httpsServer
      .listen(config.https.port, function(err) {
        if (!!err) {
          console.error('HTTPS server FAIL: ', err, (err && err.stack));
        }
        else {
          console.log(`HTTPS server OK: https://${config.domain}:${config.https.port}`);
        }
      });
  }
  catch (ex) {
    console.error('Failed to start HTTPS server\n', ex, (ex && ex.stack));
  }


  
// const io = new Server(httpsServer, {
//   cors: {
//     origin: "https://cindyhelper.duckdns.org:3000",
//     credentials: true
//   }
// });
// // console.log(koaSocketioSession(app, CONFIG));
// io.use(koaSocketioSession(app, CONFIG));
// // io.use((socket, next) => {
// //   let s = socket.session;
// //   if (!s || !s.logined) {
// //       return next(new Error('unauthorized'));
// //   }
// //   return next();
// // });
// // convert a connect middleware to a Socket.IO middleware
// // const wrap = (middleware) => (socket, next) =>
// //   middleware(socket.request, {}, next);

// // io.use(wrap(sessionMiddleware));
// // io.use(wrap(passport.initialize()));
// // io.use(wrap(passport.session()));
// // console.log(sessionMiddleware);
// // io.use((socket, next) => {
// //   sessionMiddleware(socket.request, {}, next);
// //   // if (socket.request.user) {
// //   //   next();
// //   // } else {
// //   //   next(new Error("unauthorized"));
// //   // }
// // });
// // io.engine.use(sessionMiddleware);
// io.on("connection", async (socket) => {
//     socket.join("pipeline");
//     // const session = socket.session;
//     console.log(`User Connected: ${socket.id}`);
//     // console.log(socket.session);
//     socket.on("send_message", async (data) => {
//         // let sessionId = cookie.parse(socket.handshake.headers.cookie)["koa.sess.sig"];
//         // let session = store.get(sessionId);
//         // console.log(session?"moderator" : "viewer");
//         // console.log(store);
//         // socket.broadcast.emit("receive_message", session);
//         socket.emit("pong", socket.id);
//         // await dao.getStatusWS(data).then((data) => {
//         //     let now = getNow().format('yyyy-MM-dd HH:mm:ss');
//         //     let toSend = { data: data, sendTime: now }
//         //     // console.log(data);
//         //     toSend.data.session = socket.session;
//         //     socket.emit("sendStatus", toSend); 
//         // })
//     });
//     socket.on("dateChange", async (data) => {
//       await dao.getStatusWS(data).then((data) => {
//           let now = getNow().format('yyyy-MM-dd HH:mm:ss');
//           let toSend = { data: data, sendTime: now }
//           // console.log("dateChange");
//           toSend.data.session = socket.session;
//           // console.log(socket.request.headers);
//           socket.emit("sendStatus", toSend); 
//       })
//     });
//     socket.on("addSong", async (data) => {
//       await dao.addSongWS(data).then((data) => {
//           let now = getNow().format('yyyy-MM-dd HH:mm:ss');
//           let toSend = { data: data, sendTime: now }
//           // console.log("dateChange");
          
//           toSend.data.session = socket.session;
//           io.to("pipeline").emit("sendStatus", toSend); 
//       })
//     });
//     socket.on("delSong", async (data) => {
//       await dao.delSongWS(data).then((data) => {
//           let now = getNow().format('yyyy-MM-dd HH:mm:ss');
//           let toSend = { data: data, sendTime: now }
//           // console.log(data);
//           toSend.data.session = socket.session;
//           io.to("pipeline").emit("sendStatus", toSend); 
//       })
//     });
//     socket.on("modifySong", async (data) => {
//       await dao.modifySongWS(data).then((data) => {
//           let now = getNow().format('yyyy-MM-dd HH:mm:ss');
//           let toSend = { data: data, sendTime: now }
//           // console.log("modifySong");
//           toSend.data.session = socket.session;
//           // console.log(data.songs);
//           io.to("pipeline").emit("sendStatus", toSend); 
//       })
//     });
    
//     socket.on("getStatus", async (data) => {
//       // console.log(data);
//       await dao.getStatusWS(data).then((data) => {
//           let now = getNow().format('yyyy-MM-dd HH:mm:ss');
//           let toSend = { live: data.live, sendTime: now }
//           console.log("sendStatus2");
//           socket.emit("sendStatus", toSend); 
//       })        
//     });
//     socket.on('disconnect', () => {
//         console.log(`소켓 연결 해제 | 소켓: ${socket.id}`);
//     });
// });



