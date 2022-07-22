const { json } = require('express');
const usersService = require('../services/usersService');

// 프로필 사진 삭제
exports.deleteProfilePhoto = async (req, res) => {
  const userId = req.params.id;

  const result = await usersService.deleteProfilePhoto(userId);
  const { status, ...response } = result;
  // 응답
  res.status(status).json(response);
};

// 회원 정보 요청
exports.selectUser = async (req, res) => {
  const userId = req.params.id;

  const result = await usersService.selectUser(userId);
  const { status, ...response } = result;
  // 응답
  res.status(status).json(response);
};

// 회원가입
exports.signUpLocal = async (req, res) => {
  const { email, password, nickname } = req.body;
  const userDTO = { email, password, nickname, provider: 'local' };

  const result = await usersService.signUpLocal(userDTO);
  const { status, ...response } = result;
  // 응답
  res.status(status).json(response);
};

// 회원정보 수정
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nickname, password, profileURL } = req.body;
  const userDTO = { id, nickname, password, profileURL };

  const result = await usersService.updateUser(userDTO);
  const { status, ...response } = result;
  // 응답
  res.status(status);
  res.json(response);
};

// 회원 탈퇴
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const userDTO = { id, password };

  const result = await usersService.deleteUser(userDTO);
  const { status, ...response } = result;

  // 응답
  res.status(status);
  res.json(response);
};

// 닉네임 중복확인
exports.checkNickname = async (req, res) => {
  const nickname = req.query.nickname;

  const result = await usersService.checkNickname(nickname);
  const { status, ...response } = result;
  // 응답
  res.status(status);
  res.json(response);
};

// 이메일 중복확인
exports.checkEmail = async (req, res) => {
  const email = req.query.email;

  const result = await usersService.checkEmail(email);
  const { status, ...response } = result;
  // 응답
  res.status(status);
  res.json(response);
};

// 회원이 포스팅한 글 목록 요청
exports.getUserPosts = async (req, res) => {
  const { id: userId } = req.params;

  const result = await usersService.getUserPosts(userId);
  const { status, userPosts, ...message } = result;
  // 응답
  res.status(status);
  userPosts ? res.json(userPosts) : res.json(message);
};

// 회원이 저장한 글 목록 요청
exports.getStoredPosts = async (req, res) => {
  const { id: userId } = req.params;

  const result = await usersService.getStoredPosts(userId);
  const { status, storedPosts, ...message } = result;
  // 응답
  res.status(status);
  storedPosts ? res.json(storedPosts) : res.json(message);
};

// 프로필 사진 업로드
exports.uploadPhoto = (req, res, next) => {
  //사진 업로드시 예외 발생 할 경우에만 함수가 리턴된다
  const result = usersService.uploadPhoto(req, res, next);

  if (result) {
    const { status, ...response } = result;
    res.status(status);
    res.json(response);
  }
};

//포스트 사진 업로드 후 넘어오는 요청을 처리할 컨트롤러
exports.uploadPhotoAfter = (req, res) => {
  res.status(201);
  res.json({ photoURL: req.file.location, message: '사진 업로드 완료' });
};
