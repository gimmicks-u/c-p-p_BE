const passport = require('../middlewares/package/passport');

exports.loginLocal = (req, res, next) => {
  passport.authenticate('local')(req, res, next);
};
exports.loginKakao = (req, res, next) => {
  passport.authenticate('kakao')(req, res, next);
};
exports.loginKakaoCallback = (req, res, next) => {
  passport.authenticate('kakao', {})(req, res, next);
};
exports.loginGoogle = (req, res, next) => {
  passport.authenticate('google', { scope: ['email', 'profile'] })(
    req,
    res,
    next
  );
};
exports.loginGoogleCallback = (req, res, next) => {
  passport.authenticate('google', {})(req, res, next);
};
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      res.status(401).end();
    } else {
      res.status(204).end();
    }
  });
};
