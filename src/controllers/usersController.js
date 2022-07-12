const usersService = require('../services/usersService');

exports.signUpLocal = async (req, res) => {
  const { email, password, nickname } = req.body;
  const userDTO = { email, password, nickname, provider: 'local' };

  const result = await usersService.signUpLocal(userDTO);
  const { status, ...response } = result;

  // 응답
  res.status(status);
  res.json(response);
};

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

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const userDTO = { id, password };

  const isMatchedPassword = await usersService.checkPassword(userDTO);

  if (!isMatchedPassword) {
    // 비밀번호가 일치하지 않을때
    res.status(401);
    res.json({ message: '비밀번호가 일치하지 않습니다.' });
  } else {
    const result = await usersService.deleteUser(userDTO);
    const { status, ...response } = result;
    // 응답
    res.status(status);
    res.json(response);
  }
  console.log('checkPassword 이후');
};

exports.checkNickname = async (req, res) => {
  const nickname = req.query.nickname;

  const result = await usersService.checkNickname(nickname);
  const { status, ...response } = result;
  // 응답
  res.status(status);
  res.json(response);
};

exports.checkEmail = async (req, res) => {
  const email = req.query.email;

  const result = await usersService.checkEmail(email);
  const { status, ...response } = result;
  // 응답
  res.status(status);
  res.json(response);
};

exports.getUserPosts = async (req, res) => {
  const { id: userId } = req.params;
  console.log(userId);

  // result = await usersService.checkEmail(userId);
  // const { status, ...response } = result;
  // // 응답
  // res.status(status);
  // res.json(response);
};
