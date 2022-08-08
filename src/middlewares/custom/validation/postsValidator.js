const { body, param, oneOf, query } = require('express-validator');
const { validatorErrorChecker } = require('./validatorErrorChecker');
const { check } = require('express-validator/check');

exports.createPost = [
  body('content').notEmpty().isString(),
  body('visited').notEmpty().isString().isDate(),
  body('photoURLs').notEmpty().isArray().isURL(),
  check('receiptURL')
    .if(body('receiptURL').exists())
    .notEmpty()
    .isString()
    .isURL(),
  // body('receiptURL').notEmpty().isString().isURL(),
  body('isSponsored').notEmpty().isBoolean(),
  body('cafeId').notEmpty().isInt(),
  body('rate').notEmpty().isObject(),
  validatorErrorChecker,
];

exports.readPosts = [query('cafeId').notEmpty().isInt(), validatorErrorChecker];

exports.readPost = [param('id').isInt()];

exports.updatePost = [
  param('id').isInt(),
  check('content').if(body('content').exists()).notEmpty().isString(),
  check('visited').if(body('visited').exists()).notEmpty().isString().isDate(),
  check('receiptURL')
    .if(body('receiptURL').exists())
    .notEmpty()
    .isString()
    .isURL(),
  // body('receiptURL').notEmpty().isString().isURL(),
  check('isSponsord').if(body('isSponsord').exists()).notEmpty().isBoolean(),
  check('cafeId').if(body('cafeId').exists()).notEmpty().isInt(),
  check('rate').if(body('rate').exists()).notEmpty().isObject(),
  check('photoURLs')
    .if(body('photoURLs').exists())
    .notEmpty()
    .isArray()
    .isURL(),
  validatorErrorChecker,
];

exports.deletePost = [param('id').isInt(), validatorErrorChecker];

exports.likePost = [param('id').isInt(), validatorErrorChecker];

exports.storePost = [param('id').isInt(), validatorErrorChecker];
