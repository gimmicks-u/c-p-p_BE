const { body, param, oneOf, query } = require('express-validator');
const { validatorErrorChecker } = require('./validatorErrorChecker');

exports.selectUser = [param('id').isInt(), validatorErrorChecker];

exports.signUp = [
  body('email').notEmpty().isLength({ max: 40 }).isEmail(),
  body('password').notEmpty().isLength({ min: 8, max: 20 }),
  body('nickname').notEmpty().isLength({ min: 2, max: 20 }),
  validatorErrorChecker,
];

exports.updateUser = [
  param('id').isInt(),
  oneOf([
    body('password').isLength({ min: 8, max: 20 }),
    body('nickname').isLength({ min: 2, max: 20 }),
    body('profileURL').isURL(),
  ]),
  validatorErrorChecker,
];

exports.checkNickname = [
  query('nickname').notEmpty().isLength({ min: 2, max: 20 }),
  validatorErrorChecker,
];

exports.checkEmail = [
  query('email').notEmpty().isLength({ max: 40 }).isEmail(),
  validatorErrorChecker,
];

exports.deleteUser = [
  param('id').isInt(),
  body('password').notEmpty(),
  validatorErrorChecker,
];

exports.getUserPosts = [param('id').isInt(), validatorErrorChecker];

exports.getStoredPosts = [param('id').isInt(), validatorErrorChecker];
