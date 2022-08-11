const authService = require('../services/authService');

exports.loginAfter = (req, res) => {
  console.log(req.session);
  console.log(req.user);
  res.json(req.user);
};
exports.loginAfterSocial = (req, res) => {
  console.log(req.session);
  console.log(req.user);
  const user = JSON.stringify(req.user);
  res.send(
    `<script>window.opener.postMessage('${user}','*');window.close()</script>`
  );
};

exports.loginLocal = (req, res, next) => {
  authService.loginLocal(req, res, next);
};
exports.loginKakao = (req, res, next) => {
  authService.loginKakao(req, res, next);
};
exports.loginKakaoCallback = (req, res, next) => {
  authService.loginKakaoCallback(req, res, next);
};
exports.loginGoogle = (req, res, next) => {
  authService.loginGoogle(req, res, next);
};
exports.loginGoogleCallback = (req, res, next) => {
  authService.loginGoogleCallback(req, res, next);
};
exports.logout = (req, res, next) => {
  authService.logout(req, res);
};
