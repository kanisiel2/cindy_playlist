const Router = require('koa-router');
const route = new Router();
const passport = require("koa-passport");
const CLIENT_URL = "https://cindyhelper.duckdns.org:3000/"
// Index Page
route.get('/', async (ctx, next) => {
  
   ctx.body = ctx.request.user != null ? ctx.request.user : null;;
   return next();
});
route.get("/login/success", (req,res) => {
      if(req.user) {
    res.status(200).json({
        success:true,
        message: "successful",
        user: req.user,
        //cookies: req.cookies
    });
  }
});
route.get("/login/failed", (req,res) => {
    res.status(401).json({
        success:false,
        message: "failure",
    });
});
route.get("/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);
});
route.get("/google", passport.authenticate("google", { scope: ["profile"] }));
route.get(
    "/google/callback", 
    passport.authenticate("google",{
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);
module.exports = route