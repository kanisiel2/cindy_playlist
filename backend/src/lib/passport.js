const dao = require('../lib/DAO');  // DAO 미들웨어
const axios = require('axios');
const models = require('../models');
const sequelize = require("sequelize");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TiktokStrategy = require('passport-tiktok-auth').Strategy;
const passport = require("koa-passport");
const refresh = require('passport-oauth2-refresh');
const keys = require('../config/serviceAccountKey.json');
const GOOGLE_CLIENT_ID = keys.client_keys.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = keys.client_keys.GOOGLE_CLIENT_SECRET
const TIKTOK_CLIENT_ID = keys.client_keys.TIKTOK_CLIENT_ID
const TIKTOK_CLIENT_SECRET= keys.client_keys.TIKTOK_CLIENT_SECRET

const strategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/google/callback",
    scope: [ 'profile' ],
    state: true,
    passReqToCallback   : true
  },
  //function(accessToken, refreshToken, profile, done) {
  function(request, accessToken, refreshToken, params, profile, done) {
    // console.log(params);
    models.user.findOrCreate({
      where: { user_id: profile.id},
      defaults: {
        name: profile.displayName,
        photo: profile.photos[0].value,
        refToken: refreshToken,        
        accessToken: accessToken,
        expires: Date.now() + ((params.expires_in-3)*1000)
      }
    }).then(async (user, created) => {
      if(created) {         
        console.log("***User created!***"); 
        return done(null, user);
      } else {
        models.user.update(
          {
            refToken: refreshToken,        
            accessToken: accessToken,
            expires: Date.now() + (params.expires_in*1000)
          },
          {where: { user_id: profile.id }}
        ).then(async (success)=>{            
          models.user.findOne({ where: {user_id: profile.id }})
          .then((user) => {
            user.dataValues.expires_in = params.expires_in;
            user.dataValues.id_token = params.id_token;
            console.log("***User TOKEN updated!***"); 
            return done(null, user);
          })
        }).catch((err) => {
          console.log(err);
          return done(err, null);
        });
      }
    });      
  }
);
passport.use(new TiktokStrategy({
    clientID: TIKTOK_CLIENT_ID,
    clientSecret: TIKTOK_CLIENT_SECRET,
    scope: ['user.info.basic'],    
    access_type: 'offline',
    callbackURL: "/tiktok/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    models.user.findOrCreate({
      where: { user_id: profile.id},
      defaults: {
        name: profile.displayName,
        photo: profile.photos[0].value,
        refToken: JSON.stringify(refreshToken),
      }
    }).then(async (user, created) => {
      if(created) {         
        console.log("***User created!***"); 
        return done(null, user);
      } else {
        models.user.update(
          {refToken: JSON.stringify(refreshToken)},
          {where: { user_id: profile.id }}
        ).then(async (success)=>{            
          models.user.findOne({ where: {user_id: profile.id }})
          .then((user) => {
            console.log("***User TOKEN updated!***"); 
            return done(null, user);
          })
        }).catch((err) => {
          console.log(err);
          return done(err, null);
        });
      }
    });
  }
));
passport.use(strategy);
refresh.use(strategy);
//     // console.log(profile.id);
//     // console.log("----------------------------------");
//     // console.log(profile.displayName);
//     // console.log("----------------------------------");
//     // console.log(profile.photos[0].value);
//     // console.log("----------------------------------");
//     done(null,profile );
//   }
//   )
// );
passport.serializeUser((user,done)=>{
    done(null,user);
});
passport.deserializeUser((user,done)=>{
    done(null,user);
});

module.exports.refreshDone = (refresh_Token, user_id) =>{
  
  return new Promise((resolve, reject) => {

    // oauthrefresh.use(getStrategy(params.app.config));
    // refresh.re
    refresh.requestNewAccessToken('google', refresh_Token, async (err, accessToken, refreshToken, params) => {
      // console.log(params);
        if (err) {
            return reject(err);
        }

        if (!accessToken) {
            return reject(new Error('refresh google access token give no result'));
        }
        if (refreshToken) {
          // should be the same of the initial refresh token
          // user.google.refreshToken = refreshToken;
          
        }
        await axios.get("https://www.googleapis.com/oauth2/v3/userinfo?access_token="+accessToken)
        .then(async (Response) => {
          let data=Response.data;
          // console.log(data);
          var userdata = await models.user.update(
            {    
              accessToken: accessToken,
              name: data.name,
              photo: data.picture,              
              expires: Date.now() + ((params.expires_in-3)*1000)
            },
            {
              where: { user_id: user_id }
            }
          ).then(async (success)=>{            
            await models.user.findOne({ 
              raw:true,
            }, { where: {user_id: user_id }})
            .then((user) => {           
              user.id_token = params.id_token;            
              // console.log(user.dataValues.expire);  
              // passport.serializeUser(function(user, done) {    
              //   console.log('serialize');    
              //   done(null, user);
              // });
              userdata = user;
              // console.log("in passport: ");
              // console.log(userdata);
              console.log("***User TOKEN updated!***");
              passport.serializeUser((userdata,done)=>{
                done(null,userdata);
              });
              passport.deserializeUser((userdata,done)=>{
                  done(null,userdata);
              });  
              resolve(userdata);
            })
          }).catch((err) => {
            console.log(err);                     
          });
        }).catch((err) => {
          console.log(err);                     
        });  
        
        
        
        // params.expire = Date.now() + (params.expires_in*1000);
        // let result = { access_token: accessToken, refToken: refresh_Token, params:params };
        
        
        // resolve(user.save());
    });
  });
}

// const passport = require('koa-passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const models = require('../models');
// const { jwtMiddleware } = require('../lib/token'); // jwt 미들웨어

// module.exports = () => {
//   // 구글 Strategy
//   passport.use(new GoogleStrategy({
//     "client_id":"1091068604802-2t1ghvrcu443pj91blb7u7qqvqdlv065.apps.googleusercontent.com",
//     "project_id":"sks-oauth2",
//     "auth_uri":"https://accounts.google.com/o/oauth2/auth",
//     "token_uri":"https://oauth2.googleapis.com/token",
//     "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
//     "client_secret":"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",
//     "redirect_uris":["http://localhost/","http://skscorp.duckdns.org/","http://kanisiel-server.iptime.org/"],
//     "javascript_origins":["http://localhost","http://sks.�.\m","http://skscorp.duckdns.org","http://skscorp.duckdns.org:3001","http://kanisiel-server.iptime.org","http://kanisiel-server.iptime.org:3001"],
//     "profileFields": ['id', 'email', 'displayName']
//   }, (accessToken, refreshToken, profile, done) => {
//       return done(null, profile);
//   }));  
// }

