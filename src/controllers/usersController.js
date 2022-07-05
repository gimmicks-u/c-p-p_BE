exports.signUpLocal = (req, res) => {
  const { email, password, nickname } = req.body;

  const userDTO = { email, password, nickname, provider: 'local' };
};
