const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticator = require('../middlewares/custom/authentication');

router.post(
  '/login',
  authenticator.isNotLoggedIn,
  authController.loginLocal,
  authController.loginAfter
);

router.get('/logout', authenticator.isLoggedIn, authController.logout);

// router.get("/login-check", authController.loginCheck);

router.get('/kakao', authController.loginKakao);

router.get(
  '/kakao/callback',
  authController.loginKakaoCallback,
  authController.loginAfterSocial
);

router.get('/google', authController.loginGoogle);

router.get(
  '/google/callback',
  authController.loginGoogleCallback,
  authController.loginAfterSocial
);
module.exports = router;
