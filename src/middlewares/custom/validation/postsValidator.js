const { body, param, query } = require('express-validator');
const { validatorErrorChecker } = require('./validatorErrorChecker');

exports.createPost = [
  body('content').notEmpty().isString(),
  body('visited').notEmpty().isString().isDate(),
  body('photoURLs').notEmpty().isArray(),
  body('photoURLs.*').isURL(),
  body('receiptURL')
    .notEmpty()
    .isString()
    .isURL()
    .optional({ checkFalsy: true }),
  body('isSponsored').notEmpty().isBoolean(),
  body('cafeId').notEmpty().isInt(),
  body('rate').notEmpty().isObject(),
  validatorErrorChecker,
];

exports.readPosts = [query('cafeId').notEmpty().isInt(), validatorErrorChecker];

exports.readPost = [param('id').isInt()];

exports.updatePost = [
  param('id').isInt(),
  body('content').notEmpty().isString().optional({ checkFalsy: true }),
  body('visited').notEmpty().isString().isDate().optional(),
  body('photoURLs').notEmpty().isArray(),
  body('photoURLs.*').isURL(),
  body('receiptURL')
    .notEmpty()
    .isString()
    .isURL()
    .optional({ checkFalsy: true }),
  body('isSponsored').notEmpty().isBoolean().optional(),
  body('cafeId').notEmpty().isInt().optional(),
  body('rate').notEmpty().isObject().optional(),
  validatorErrorChecker,
];

exports.deletePost = [param('id').isInt(), validatorErrorChecker];

exports.likePost = [param('id').isInt(), validatorErrorChecker];

exports.storePost = [param('id').isInt(), validatorErrorChecker];
