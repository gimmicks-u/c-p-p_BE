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
