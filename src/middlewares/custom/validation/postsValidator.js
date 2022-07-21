const { body, param, oneOf, query } = require('express-validator');
const { validatorErrorChecker } = require('./validatorErrorChecker');

exports.createPost = [
  body('content').notEmpty().isString(),
  body('visited').notEmpty().isString().isDate(),
  body('photoURLs').notEmpty().isArray().isURL(),
  body('receiptURL').notEmpty().isString().isURL(),
  body('isSponsored').notEmpty().isBoolean(),
  body('cafeId').notEmpty().isInt(),
  body('rate').notEmpty().isObject(),
  validatorErrorChecker,
];

exports.readPosts = [query('cafeId').notEmpty().isInt(), validatorErrorChecker];

exports.readPost = [param('id').isInt()];

exports.updatePost = [
  param('id').isInt(),
  oneOf([
    body('content').notEmpty().isString(),
    body('visited').notEmpty().isString().isDate(),
    body('photoURLs').notEmpty().isArray().isURL(),
    body('receiptURL').notEmpty().isString().isURL(),
    body('isSponsored').notEmpty().isBoolean(),
    body('cafeId').notEmpty().isInt(),
    body('rate').notEmpty().isObject(),
  ]),
  body('photoURLs').notEmpty().isArray().isURL(),
  body('receiptURL').notEmpty().isString().isURL(),
  validatorErrorChecker,
];

exports.deletePost = [param('id').isInt(), validatorErrorChecker];

exports.likePost = [param('id').isInt(), validatorErrorChecker];

exports.storePost = [param('id').isInt(), validatorErrorChecker];
