const { body, query } = require('express-validator');
const { validatorErrorChecker } = require('./validatorErrorChecker');

exports.createCafe = [
  body('name').notEmpty().isLength({ max: 30 }),
  body('address').notEmpty().isLength({ max: 50 }),
  body('lat').notEmpty().isFloat({ min: 33, max: 43 }),
  body('lng').notEmpty().isFloat({ min: 124, max: 132 }),
  body('phone')
    .notEmpty()
    .isString()
    .isLength({ max: 30 })
    .optional({ checkFalsy: true }),
  // body('openingHours').notEmpty().isLength({ max: 100 }),
  validatorErrorChecker,
];

exports.searchCafe = [
  query('keyword').notEmpty().isString(),
  validatorErrorChecker,
];

exports.cafesInMap = [
  query('swLat').notEmpty(),
  query('swLng').notEmpty(),
  query('neLat').notEmpty(),
  query('neLng').notEmpty(),
  validatorErrorChecker,
];
