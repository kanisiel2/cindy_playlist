
const passport = require('koa-passport');
const passportConfig = require('../lib/passport');
const models = require('../models');
const tokenServer = require('../lib/token'); // jwt 미들웨어

passportConfig();

// 구글 로그인 콜백
exports.ggLoginCb = (ctx) => {
    return passport.authenticate('google', { session: false, failureRedirect: '/login/google' }, async (err, profile, info) => {

        // 계정 조회
        models.User.findOrCreate({
          where: { emails: profile.emails[0].value },
          defaults: {
            google_id: profile.id,
            name: profile.displayName
          }
        })
        .then((result) => {
          if (result.isNewRecord) {
            console.log('Row inserted!');
          } else {
            console.log('Found user!');
          }
        });


        // 토큰 생성
        const token = await tokenServer.generateToken({ profile }, 'user');

        // 토큰을 쿠키에 저장
        ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
        //setTokenToCookie(ctx, token);

        // 페이지 리다이렉트
        ctx.redirect('/');
    })(ctx);
}

exports.check = (ctx) => {
    const { user } = ctx.request;

    if(!user) {
        ctx.response.status = 403; // Forbidden
        return;
    }

    ctx.body = user.profile;
};


exports.logout = async (ctx) => {
  ctx.cookies.set('access_token', null, {
      maxAge: 0,
      httpOnly: true
  });
  ctx.response.status = 204;
  // 페이지 리다이렉트
  ctx.redirect('/');
};
