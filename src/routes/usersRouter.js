const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const usersValidator = require('../middlewares/custom/validation/usersValidator');

// 닉네임 중복확인
router.get(
  '/nickname',
  usersValidator.checkNickname,
  usersController.checkNickname
);

// 이메일 중복확인
router.get('/email', usersValidator.checkEmail, usersController.checkEmail);

// 회원 정보 요청
router.get('/:id', usersValidator.selectUser, usersController.selectUser);

// 회원가입
router.post('/', usersValidator.signUp, usersController.signUpLocal);

// 회원정보 수정
router.patch('/:id', usersValidator.updateUser, usersController.updateUser);

// 회원 탈퇴
router.delete('/:id', usersValidator.deleteUser, usersController.deleteUser);

// 회원이 포스팅한 글 목록 요청
router.get(
  '/:id/posts',
  usersValidator.getUserPosts,
  usersController.getUserPosts
);

// 회원이 저장한 글 목록 요청
router.get(
  '/:id/stored-posts',
  usersValidator.getStoredPosts,
  usersController.getStoredPosts
);

// 프로필 사진 업로드
router.post(
  '/photo',
  usersController.uploadPhoto,
  usersController.uploadPhotoAfter
);

module.exports = router;
