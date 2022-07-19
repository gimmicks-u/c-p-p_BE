const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// 회원 정보 요청
router.get('/:id', usersController.selectUser);

// 회원가입
router.post('/', usersController.signUpLocal);

// 회원정보 수정
router.patch('/:id', usersController.updateUser);

// 회원 탈퇴
router.delete('/:id', usersController.deleteUser);

// 닉네임 중복확인
router.get('/nickname', usersController.checkNickname);

// 이메일 중복확인
router.get('/email', usersController.checkEmail);

// 회원이 포스팅한 글 목록 요청
router.get('/:id/posts', usersController.getUserPosts);

// 회원이 저장한 글 목록 요청
router.get('/:id/stored-posts', usersController.getStoredPosts);

// 프로필 사진 업로드
router.post(
  '/photo',
  usersController.uploadPhoto,
  usersController.uploadPhotoAfter
);

module.exports = router;
