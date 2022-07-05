const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.loginLocal, authController.loginAfter);

router.get('/logout', authController.logout);

// router.get("/login-check", authController.loginCheck);

router.get('/kakao', authController.loginKakao);

router.get(
  '/kakao/callback',
  authController.loginKakaoCallback,
  authController.loginAfter
);

router.get('/google', authController.loginGoogle);

router.get(
  '/google/callback',
  authController.loginGoogleCallback,
  authController.loginAfter
);
module.exports = router;
