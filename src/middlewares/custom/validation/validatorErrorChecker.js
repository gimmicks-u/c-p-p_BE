const { validationResult } = require('express-validator');

exports.validatorErrorChecker = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: '입력하신 정보를 확인해주세요.' });
  }
  next();
};
