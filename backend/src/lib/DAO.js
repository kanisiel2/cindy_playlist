const models = require('../models');
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const passportTools = require("./passport");
const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
const CLIENT_URL = "https://song.cindy.team:3000/"
const axios = require('axios');
const webPush = require("web-push");
const { vapidKeys } = require("./webpush");
const { GCMAPIKey } = require("./webpush");

if (!vapidKeys.publickey || !vapidKeys.privatekey) {
  console.log(
    "You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY " +
      "environment variables. You can use the following ones:"
  );
  console.log(webPush.generateVAPIDKeys());
}
// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
  "https://song.cindy.team/",
  vapidKeys.publickey,
  vapidKeys.privatekey
);

// var admin = require("firebase-admin");
// var Messaging = require('firebase-admin/messaging');
// var serviceAccount = require("../config/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   projectId: serviceAccount.project_id
// });

var json = {};
var devices = [];


//숫자 프로토타입으로 입력 길이만큼 앞에 0을 채운 문자열 반환
Number.prototype.fillZero = function(width){
    let n = String(this);//문자열 변환
    return n.length >= width ? n:new Array(width-n.length+1).join('0')+n;//남는 길이만큼 0으로 채움
}

//문자열 프로토타입으로 입력 길이만큼 앞에 0을 채운 문자열 반환
String.prototype.fillZero = function(width){
    return this.length >= width ? this:new Array(width-this.length+1).join('0')+this;//남는 길이만큼 0으로 채움
}

exports.test = {test:"이건 테스트"};
var devices = [];
exports.addDevice = async (ctx, next) => {
  // console.log(ctx.request.body);
  json.token = await managePushToken(JSON.stringify(ctx.request.body.data),"update");
  // // if(devices.indexOf(ctx.request.body.data)<0) devices.push(ctx.request.body.data);
  // // console.log(devices);
  // let data = JSON.stringify(ctx.request.body.data);
  // // console.log(data);
  // if(data){
  //   var token = await models.webtoken.findOne({ where : { token: data }}).then(async (result) => {
  //     if(result){
  //       return result;
  //     } else {
  //       return await models.webtoken.create({ token: data });
  //     }
  //   });
  // }  
  ctx.request.user = json;
  return next();
}
const sendPushs = async (tokens, data) => {
  const noti = {
      title: "신디 방송 알람!",
      body: "신디가 방송을 켰어요~",
      tag: "cindyyyyy_kr",
      icon: "https://song.cindy.team:3002/logo.png",
      badge: "https://song.cindy.team:3002/badge.png",
  }
  if(data){
    noti.title = data.title ? data.title : noti.title;
    noti.body = data.body ? data.body : noti.body;
  }
  tokens.map((item) => {
    // console.log(item);
    // console.log(JSON.stringify(noti));
    webPush
    .sendNotification(item, JSON.stringify(noti),{
      TTL: 0,
    })
    .then(function () {
      // res.sendStatus(201);
    })
    .catch(function (error) {
      // res.sendStatus(500);
      console.log(error);
    });
  });
  // Messaging.getMessaging().sendEachForMulticast
  // Messaging.getMessaging().sendEachForMulticast(message)
  // .then((response) => {
  //     console.log(response.successCount + ' messages were sent successfully');
  //     return response.successCount;
  // });
}
//where: { id : { [Op.gt] : [7] }},
const getDevice = async () => {
  let devices = await models.webtoken.findAll({ attributes: ["token"], raw: true } ).then((results) => {
      return results.map((row) => {
          return JSON.parse(row.token)
      })
  });
  return devices;
}

exports.sendPush = async (ctx, next) => {
  devices = await getDevice();                
  let data = ctx.request.body.data ? ctx.request.body.data : null;
  // console.log(devices);
  sendPushs(devices, data);
  return next();
}

//라이브 상태 가져오기
exports.getStatusWS = async (data) => {
  // console.log("inside getStatusWS");
  // console.log(data);
  
  json.status = await models.status.findOne(
    { attributes:['live'], raw:true,
    order: [ [ 'id', 'desc' ]],
  });
  // console.log(json.status);
  json.songs = await models.song.findAll({
    where: {
      dates: data.date,
    },
    order: [ [ 'proc', 'asc' ]],
  });
  json.remainSongs = await models.song.findAll({
    where: {
      isComplete: false,
      dates: data.date,
    },
    order: [ [ 'proc', 'asc' ]],
  });
  json.songsComplete = await models.song.findAll({
    where: {
      isComplete: true,
      dates: data.date,
    },
    order: [ [ 'proc', 'asc' ]],
  });
  json.songs.forEach( (item,index) => {
    delete item.dataValues.createdAt
    delete item.dataValues.updatedAt
  });
  json.songsComplete.forEach( (item,index) => {
    delete item.dataValues.createdAt
    delete item.dataValues.updatedAt
  });
  // json.session = ctx.session;
  // ctx.request.user = json;
  // console.log(json.songs);
  return json;
};

//신청곡 등록
exports.addSongWS = async (data) => {
  // console.log(data);

  json.status = await models.status.findOne(
    { attributes:['live'], raw:true,
    order: [ [ 'id', 'desc' ]],
  });
  json.success = await models.song.create(data.data);
  // console.log(json.status);
  json.songs = await models.song.findAll({
    where: {
      dates: data.data.dates,
    },
    order: [ [ 'proc', 'asc' ]],
  });
  json.songs.forEach( (item,index) => {
    delete item.dataValues.createdAt
    delete item.dataValues.updatedAt
  });
  // json.session = ctx.session;
  // // ctx.request.user = json;
  return json;
};

//신청곡 삭제
exports.delSongWS = async (data) => {
  // console.log(data);

  json.status = await models.status.findOne(
    { attributes:['live'], raw:true,
    order: [ [ 'id', 'desc' ]],
  });
  json.deletedRows = await models.song.destroy(data.where);
  json.songs = await models.song.findAll({
    where: {
      dates: data.dates,
    },
    order: [ [ 'proc', 'asc' ]],
  });
  // json.session = ctx.session;
  return json;
};

//신청곡 업데이트
exports.modifySongWS = async (data) => {
  // console.log(data);
  
  if(data.isArray){
    data.datas.forEach( async (v) => {
      await models.song.update( v.data, v.where );
    });
  } else {
    let success = await models.song.update( data.datas.data, data.datas.where );
    // console.log(success);
  }
  json.status = await models.status.findOne(
    { attributes:['live'], raw:true,
    order: [ [ 'id', 'desc' ]],
  });
  json.songs = await models.song.findAll({
    where: {
      dates: data.dates,
    },
    order: [ [ 'proc', 'asc' ]],
  });
  // json.session = ctx.session;
  return json;
};

const firebaseConfig = {
  apiKey: "AIzaSyAd1D1upKIvbZr9TLU7nH9G4g3Mvgv96ug",
  authDomain: "cindyhelper-a7b4b.firebaseapp.com",
  projectId: "cindyhelper-a7b4b",
  storageBucket: "cindyhelper-a7b4b.appspot.com",
  messagingSenderId: "624352902528",
  appId: "1:624352902528:web:20ea2f32ad6b713cbf5565"
};

//for axios+router0

  async function managePushToken(webtoken, mode) {
    // console.log(webtoken);
    let tokenObj = JSON.parse(webtoken);
    var token = await models.webtoken.findOne({ where : { endpoint: tokenObj.endpoint }, raw: true }).then(async (result) => {
      if(result){
        if(mode === "update"){
          // console.log(result.id);
          return await models.webtoken.update({ endpoint: tokenObj.endpoint, token: webtoken }, { where: { id: result.id }}).then((result)=>{
            console.log("update Token!");
            return result;
          }).catch((e) => {
            console.log(e);
            return null;
          });
        } else {
          return result;
        }
      } else {
        return await models.webtoken.create({ endpoint: tokenObj.endpoint, token: webtoken });
      }
    });
  }
  // exports.updateToken = async (ctx, next) => {
  //   console.log(ctx.request.body);
  //   // if(ctx.request.body.token){
  //   //   managePushToken(ctx.request.body.token,"update");
  //   // }
  //   return next();
  // };

  //라이브 상태 가져오기
  exports.getStatus = async (ctx, next) => {
    // console.log(ctx.request.body.token);
  //   await axios.post(
  //     "https://fcm.googleapis.com/fcm/notification",
  //     { 
  //         "operation": "create",
  //         "notification_key_name": "cindy_is_live",
  //         "registration_ids": []
  //     }, {
  //         headers: {
  //             "Content-Type":"application/json",
  //             Authorization:"key="+firebaseConfig.apiKey,
  //             "project_id":firebaseConfig.projectId,
  //             "Access-Control-Allow-Origin":"*"
  //         }
  //     })
  // .then((Response)=>{
  //     console.log(Response);
  // }).catch((Error)=>{console.log(Error)});;
    // console.log(ctx.request.body.token);
    if(ctx.request.body.token){
      console.log(ctx.request.body.token);
      // managePushToken(JSON.stringifyctx.request.body.token,"update");
      // console.log(devices.indexOf(ctx.request.body.token));
      // if(devices.indexOf(ctx.request.body.token) < 0){                
      //   console.log("not exist!");
      //   devices.push(ctx.request.body.token)
      //   // // Subscribe the devices corresponding to the registration tokens to the
      //   // // topic.
      //   // getMessaging().subscribeToTopic(devices, "liveOnOff")
      //   // .then((response) => {
      //   //   // See the MessagingTopicManagementResponse reference documentation
      //   //   // for the contents of response.
      //   //   console.log('Successfully subscribed to topic:', response);
      //   // })
      //   // .catch((error) => {
      //   //   console.log('Error subscribing to topic:', error);
      //   // });
      // }
      // else { 
      //   console.log("exist!");
      // }
    }
    // console.log(devices);
    
   
    
    json.status = await models.status.findOne(
      { attributes:['live'], raw:true,
      order: [ [ 'id', 'desc' ]],
    });
    // console.log(ctx.request.body.date);
    json.songs = await models.song.findAll({
      where: {
        dates: ctx.request.body.date,
      },
      order: [ [ 'proc', 'asc' ]],
    });
    // json.remainSongs = await models.song.findAll({
    //   where: {
    //     isComplete: false,
    //     dates: ctx.request.body.date,
    //   },
    //   order: [ [ 'proc', 'asc' ]],
    // });
    // json.songsComplete = await models.song.findAll({
    //   where: {
    //     isComplete: true,
    //     dates: ctx.request.body.date,
    //   },
    //   order: [ [ 'proc', 'asc' ]],
    // });
    json.songs.forEach( (item,index) => {
      delete item.dataValues.createdAt
      delete item.dataValues.updatedAt
    });
    // json.songsComplete.forEach( (item,index) => {
    //   delete item.dataValues.createdAt
    //   delete item.dataValues.updatedAt
    // });
    json.session = ctx.session;
    ctx.request.user = json;
    // console.log(json.songs);
    return next();
  };

  
  //유저 정보 가져오기
  exports.getUser = async (ctx, next) => {
    // console.log(ctx.session.passport.user);
    // const [userdata, created] = await models.user.findOrCreate({
    //   where: { user_id: ctx.request.body.id },
    //   defaults: {
    //     name: data.name,
    //     photo: data.photo,
    //     refToken: data.refToken,
    //   },
    // });

    // return { user: userdata, succuss: created };
    // console.log(ctx.session);
    if(ctx.session.passport){
      // json.user = {
      //   user_id: ctx.session.passport.user.user_id,
      //   name: ctx.session.passport.user.name,
      //   photo: ctx.session.passport.user.photo,
      //   refToken: ctx.session.passport.user.refToken,
      //   accessToken: ctx.session.passport.user.accessToken
      // };
      // json.user = ctx.session.passport.user;
      json.user = await models.user.findOne(
        { 
          raw:true,
        },{ 
          where: { 
            user_id: ctx.session.passport.user.user_id
          }
        }
      );
      ctx.request.user = json;
    }    

    return next();
  };

  //유저 토큰 업데이트

  exports.updateToken = async (ctx, next) => {
    // console.log(ctx.session.passport.user.refToken);
    // json.ref = JSON.parse(ctx.session.passport.user.refToken);
    // ctx.request.user = json;
    json.user = await passportTools.refreshDone(
      ctx.session.passport.user.refToken, ctx.session.passport.user.user_id
    ).then((tokens) => {
      // console.log(tokens);
      // console.log(ctx.session.passport.user);
      // json.user = tokens;
      return tokens;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });    
    // console.log(json);
    ctx.request.user = json;
    // ctx.session.passport.user.refToken = JSON.stringify(token)
    // // console.log(ctx.session.passport.user);
    // let data = {
    //   refToken: ctx.session.passport.user.refToken
    // }
    // await models.user.update( data, { where : { id: ctx.session.passport.user.id }} );
    // //   where: { user_id: data.id },
    // //   defaults: {
    // //     name: data.name,
    // //     photo: data.photo,
    // //     refToken: data.refToken,
    // //   },
    // // });
    return next();
  }

  //라이브 상태 추가
  exports.addStatus = async (data) => {
    
    var success = await models.status.create(data);

    return success;
  };

  //라이브데이터 추가
  exports.addLivedata = async (data, where) => {
    
    var success = await models.livedata.findOrCreate({
      where: { date: where.date },
      defaults: {
        upTime: data.upTime,
        num:1
      }
    })
    
    return success;
  };

  //라이브 상태 업데이트
  exports.updateStatus = async (data, target) => {
    console.log(data);
    console.log(target);

    var success = await models.status.update(data, target).then(()=>{
      return true;
    }).catch((e) => {
      console.log(e);
      return false;
    });
    return success;
  }

  //라이브 상태 업데이트2
  exports.updateStat  = async (ctx, next) => {
    // console.log(ctx.request.body);
    let now = new Date().format('yyyy-MM-dd HH:mm:ss');
    let date = ctx.request.body.date;
    // let crankUP = ctx.request.body.crankup;
    let live = await models.status.findOne(
      { attributes:['live'],
      raw:true,
      order: [ [ 'id', 'desc' ]],
    });  
    
    if(live.live){
      live.live = 0;
      var targets = await models.livedata.findOne({
        where: { date: date },
        attributes:['id'],
        raw:true,
        order: [ [ 'id', 'desc' ]],      
      });
      // console.log(targets.id);    
      if(targets.id === null ){
        var targets = await models.livedata.findOne({
          attributes:['id'],
          raw:true,
          order: [ [ 'id', 'desc' ]],      
        });
      }
      var updateStatus = await models.livedata.update({endTime: now}, { where: { id:targets.id} }).then(()=>{
        return true;
      }).catch((e) => {
        console.log(e);
        return false;
      });
    } else {
      live.live = 1;
      var targets = await models.livedata.findAll({
        where: { date: date },
        attributes:['id'],
        raw:true,
        order: [ [ 'id', 'desc' ]],      
      });
  
      let num = targets.length > 0 ? targets.length+1 : 1;
      
      var success = await models.livedata.findOrCreate({
        where: { date: date, num: num },
        defaults: {
          upTime: date
        }
      })
      json.added = success;
    }
    var statuses = await models.status.update({ live:live.live }, { where: {id:1} }).then(()=>{
      return true;
    }).catch((e) => {
      console.log(e);
      return false;
    });
    json.updatedStat = statuses;
    
    ctx.request.user = json;
    
    return next();
  }
    

  //라이브데이터 업데이트
  exports.updateLivedata = async (data, target) => {

    var success = await models.livedata.update(data, target).then(()=>{
      return true;
    }).catch((e) => {
      console.log(e);
      return false;
    });
    return success;
  }

  //유저 추가
  exports.findOrCreateUser = async (data) => {
    
    const [userdata, created] = await models.user.findOrCreate({
      where: { user_id: data.id },
      defaults: {
        name: data.name,
        photo: data.photo,
        refToken: data.refToken,
      },
    });

    return { user: userdata, succuss: created };
  };


  exports.setVideo = async (ctx, next) => {
    
      //1. 크로미움으로 브라우저를 연다. 
      await puppeteer.launch({headless:false}).then(async (browser) => {

      await models.song.findAll({      
        order: [ ['id', 'asc'] ],
      }).then( async (songs) => {
        let max = songs.length;
        for(var i = 0; i < max ; i++){
          await getURL(browser, songs[i], i, max);
          await timer(3000);
        }
        // songs.forEach(async (item, index) => {
        //   // if(index === 1 ){

        //   setTimeout(await getURL(browser, item, index, max), 6000);
          
        // // }
        // })
      });
    })
    // browser.close();
  }
  const timer = ms => new Promise(res=>setTimeout(res,ms));
  async function getURL (browser, item, index, max) {
    try {      
              
      //2. 페이지 열기
      page = await browser.newPage(); 
      // console.log(item.singer+"+"+item.title);/
    
      let searchTerm = item.singer+"+"+item.title;
      let uriHeader = "https://music.bugs.co.kr/search/integrated?q=";
      await page.goto(uriHeader+searchTerm.replace(/\s/g,"+"));

      //4. HTML 정보 가지고 온다.
      const content = await page.content();

      const $ = cheerio.load(content);
      
      let img = $(".trackList > tbody > tr").find('td > a > img')[0].attribs.src;        
      let imgHeader = img.split("?")[0].split('50');
      
      // //3. 링크 이동
      // let uriHeader = "https://www.youtube.com/results?search_query=";
      // await page.goto(uriHeader+searchTerm.replace(/\s/g,"+"));

      // //4. HTML 정보 가지고 온다.
      // const content = await page.content();

      // const $ = cheerio.load(content);
      // // let link;
      // // console.log($(".ytd-thumbnail")[0].attributes);
      // $(".ytd-thumbnail").each(function(){
      //     if($(this).attr('href')){
      //       item.video = "https://www.youtube.com/"+$(this).attr('href');           
      //       return false;
      //     } 
      //     // console.log($(this).find('.e1vl87hj3').text());
      //     // if()
      // })
      await models.song.update( { thumbnail1:imgHeader[0], thumbnail2:imgHeader[1] }, {where : { id: item.id }} );
      console.log(img)
      console.log(index+"/"+max+"("+(index/max*100)+"%)");
    
      page.close();
      // browser.close();
    
    } catch (error) {
        console.error(error);
    }
  }

  const dateToString = (date) => {
    let datestrings = getKST(date).toLocaleString('ko-KR').substring(0,12).replace(". ", "-").replace(". ", "-").replace(".", "").split("-");        
    datestrings = datestrings.map((item)=> {
        if(item*1<10){
            return "0"+item;
        } else {
            return item;
        }
    })
    return datestrings.join("-");
  }
  function getKST(curr){
    // 2. UTC 시간 계산
    const utc = 
        curr.getTime() + 
        (curr.getTimezoneOffset() * 60 * 1000);

    // 3. UTC to KST (UTC + 9시간)
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const kr_curr = 
        new Date(utc + (KR_TIME_DIFF));

    return kr_curr;
  }


  //신청곡 등록
  exports.addSong = async (ctx, next) => {
    // console.log();
    let searchTerm = ctx.request.body.data.singer+"+"+ctx.request.body.data.title;
    json.video = await initialize(searchTerm.replace(/\s/g,"+"));
    json.video = "https://www.youtube.com"+json.video;
    json.thumbnail = await thumbnail(searchTerm.replace(/\s/g,"+"));
    // console.log(json.video);
    // /watch?v=bqG_Ckci5l0&pp=ygUp6rK97IScIOyyqyDtgqTsiqTsl5Ag64K0IOyLrOyepeydgCAxMjBCUE0%3D
    json.status = await models.status.findOne(
      { attributes:['live'], raw:true,
      order: [ [ 'id', 'desc' ]],
    });
    let songData = ctx.request.body.data;
    songData.dates = ctx.request.body.dates?ctx.request.body.dates:ctx.request.body.data.dates?ctx.request.body.data.dates:dateToString(new Date());
    songData.video = json.video;
    songData.thumbnail1 = json.thumbnail[0];
    songData.thumbnail2 = json.thumbnail[1];
    json.success = await models.song.create(songData);
    // console.log(json.status);
    json.songs = await models.song.findAll({
      where: {
        dates: songData.dates,
      },
      order: [ [ 'proc', 'asc' ]],
    });
    json.songs.forEach( (item,index) => {
      delete item.dataValues.createdAt
      delete item.dataValues.updatedAt
    });
    json.session = ctx.session;
    ctx.request.user = json;
    return next();
  };

  //신청곡 삭제
  exports.delSong = async (ctx, next) => {
    // console.log(ctx.request.body);
    
    json.status = await models.status.findOne(
      { attributes:['live'], raw:true,
      order: [ [ 'id', 'desc' ]],
    });
    json.deletedRows = await models.song.destroy(ctx.request.body.where);
    json.songs = await models.song.findAll({
      where: {
        dates: ctx.request.body.dates,
      },
      order: [ [ 'proc', 'asc' ]],
    });
    json.session = ctx.session;
    ctx.request.user = json;
    return next();
  };

  //신청곡 업데이트
  exports.modifySong = async (ctx, next) => {
    // console.log(ctx.request.body);
    
    if(ctx.request.body.isArray){
      if(ctx.request.body.sortable){
        ctx.request.body.datas.forEach( async (v) => {
          await models.song.update( {proc: v.proc}, { where: { id: v.id }} );
        });
      } else {
        ctx.request.body.datas.forEach( async (v) => {
          await models.song.update( v.data, v.where );
        });
      }
    } else {
      await models.song.update( ctx.request.body.datas.data, ctx.request.body.datas.where );
    }
    json.status = await models.status.findOne(
      { attributes:['live'], raw:true,
      order: [ [ 'id', 'desc' ]],
    });
    json.songs = await models.song.findAll({
      where: {
        dates: ctx.request.body.dates,
      },
      order: [ [ 'proc', 'asc' ]],
    });
    json.session = ctx.session;
    ctx.request.user = json;
    return next();
  };



exports.addRank = async (ctx, next) => {

  // console.log(ctx.request.body)
  let data = ctx.request.body.datas
  // console.log({
  //   where: { 
  //     [Op.and]: [{ name: data.name }, { type: data.type }]
  //   },
  //   defaults: {
  //     rank: data.rank,
  //     point: data.point,
  //     season: data.season,
  //   },
  // })
  const [userdata, created] = await models.ranking.findOrCreate({
    where: { 
      name: data.name,
      type: data.type,
      season: data.season,
    },
    defaults: {
      rank: data.rank,
      point: data.point,
    },
  });
  const coinRanks = await models.ranking.findAll({
    where: {
     season: data.season,
     type: "coin"
    },
    raw: true
  });
  const viewRanks = await models.ranking.findAll({
    where: {
      season: data.season,
      type: "view"
    },
    raw: true
  })
  
  let ranks = {
    coin: coinRanks,
    view: viewRanks,
    session: ctx.session,
  }
  
  ctx.request.user = ranks;

  return next();
}

exports.delRank = async (ctx, next) => {

  // console.log(ctx.request.body);
  let rank = ctx.request.body.rank;
  const toDel = await models.ranking.findOne({
    where: {
     id: rank.id
    }
  });
  console.log(toDel);

  await toDel.destroy();

  const coinRanks = await models.ranking.findAll({
    where: {
     season: rank.season,
     type: "coin"
    },
    raw: true
  });
  const viewRanks = await models.ranking.findAll({
    where: {
      season: rank.season,
      type: "view"
    },
    raw: true
  })
  
  let ranks = {
    coin: coinRanks,
    view: viewRanks,
    session: ctx.session,
  }
  
  ctx.request.user = ranks;
  
  return next();
}

//랭킹 업데이트
exports.modifyRank = async (ctx, next) => {
  // console.log(ctx.request.body);
  
  if(ctx.request.body.isArray){
    if(ctx.request.body.sortable){
      ctx.request.body.datas.forEach( async (v) => {
        await models.rank.update( { rank: v.rank }, { where: { id: v.id }} );
      });
    } else {
      ctx.request.body.datas.forEach( async (v) => {
        await models.rank.update( v.data, v.where );
      });
    }
  } else {
    await models.rank.update( ctx.request.body.datas.data, ctx.request.body.datas.where );
  }
  const coinRanks = await models.ranking.findAll({
    where: {
     season: ctx.request.body.season,
     type: "coin"
    },
    raw: true
  });
  const viewRanks = await models.ranking.findAll({
    where: {
      season: ctx.request.body.season,
      type: "view"
    },
    raw: true
  })
  
  let ranks = {
    coin: coinRanks,
    view: viewRanks,
    session: ctx.session,
  }
  
  ctx.request.user = ranks;
  return next();
};

exports.getRanks = async (ctx, next) => {
  console.log(ctx.request.body);
    
  const coinRanks = await models.ranking.findAll({
    where: {
     season: ctx.request.body.season,
     type: "coin"
    },
    raw: true
  });
  const viewRanks = await models.ranking.findAll({
    where: {
      season: ctx.request.body.season,
      type: "view"
    },
    raw: true
  })
  
  let ranks = {
    coin: coinRanks,
    view: viewRanks,
    session: ctx.session,
  }
  
  ctx.request.user = ranks;
  return next();
};


// var isLive = false;
// var targets = {
//     status: null,
//     liveData: null,
// };

var browser = null;
var page = null;

const initialize = async (searchTerm) => {
    try {
        //1. 크로미움으로 브라우저를 연다. 
        browser = await puppeteer.launch({
          executablePath: '/usr/bin/chromium-browser',
          headless:"new"}); // -> 여기서 여러가지 옵션을 설정할 수 있다.
                
        //2. 페이지 열기
        page = await browser.newPage();                
                      
        //3. 링크 이동
        let uriHeader = "https://www.youtube.com/results?search_query=";
        // %EA%B2%BD%EC%84%9C+%EC%B2%AB+%ED%82%A4%EC%8A%A4%EC%97%90+%EB%82%B4+%EC%8B%AC%EC%9E%A5%EC%9D%80
        await page.goto(uriHeader+searchTerm);

        //4. HTML 정보 가지고 온다.
        const content = await page.content();

        const $ = cheerio.load(content);
        let link;
        // console.log($(".ytd-thumbnail")[0].attributes);
        $(".ytd-thumbnail").each(function(){
            if($(this).attr('href')){
              link = $(this).attr('href');           
              return false;
            } 
            // console.log($(this).find('.e1vl87hj3').text());
            // if()
        })
        
        page.close();
        browser.close();
        return link;
    } catch (error) {
        console.error(error);
    }
};

const thumbnail = async (searchTerm) => {
  try {
      //1. 크로미움으로 브라우저를 연다. 
      browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        headless:"new"}); // -> 여기서 여러가지 옵션을 설정할 수 있다.
              
      //2. 페이지 열기
      page = await browser.newPage();                
                    
      //3. 링크 이동
      // let searchTerm = item.singer+"+"+item.title;
      let uriHeader = "https://music.bugs.co.kr/search/integrated?q=";
      let srcHeader = "https://image.bugsm.co.kr/album/images/";
      // await page.goto(uriHeader+searchTerm.replace(/\s/g,"+"));
      // let uriHeader = "https://www.youtube.com/results?search_query=";
      // %EA%B2%BD%EC%84%9C+%EC%B2%AB+%ED%82%A4%EC%8A%A4%EC%97%90+%EB%82%B4+%EC%8B%AC%EC%9E%A5%EC%9D%80
      await page.goto(uriHeader+searchTerm);

      //4. HTML 정보 가지고 온다.
      const content = await page.content();

      const $ = cheerio.load(content);
      let img = $(".trackList > tbody > tr").find('td > a > img')[0]? $(".trackList > tbody > tr").find('td > a > img')[0].attribs.src : "https://image.bugsm.co.kr/album/images/50/150772/15077297.jpg";        
      // console.log(img.replace(srcHeader, "").split("?")[0].substring(2));
      let imgHeader = img.replace(srcHeader, "").split("?")[0].substring(2);
      
      page.close();
      browser.close();
      return [srcHeader,imgHeader];
  } catch (error) {
      console.error(error);
  }
};

function getNow(){
  const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간
  const d = new Date();

  return new Date(d.getTime() + TIME_ZONE);
  
}
    
// const startCrawl = async function() {
//     const playAlert = setInterval(async function() {
//         await getHtml();
//     }, 10000);
// };
// initialize().then( async () => {
//     await getHtml();
//     await startCrawl();
// })