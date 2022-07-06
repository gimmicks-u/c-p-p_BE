const usersService = require('../services/usersService');

exports.signUpLocal = (req, res) => {
  const { email, password, nickname } = req.body;

  const userDTO = { email, password, nickname, provider: 'local' };

  const result = usersService.createUser(userDTO);

  res.status(result.status);
  const { status, ...response } = result;
  res.json(response);
};

exports.selectUser = (req, res) => {
  const userId = req.params.id;

  const row = usersService.selectUser(userId);

  res.status(result.status);
  const { status, ...response } = result;
  res.json(response);
};
