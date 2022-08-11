const express = require('express');
const router = express.Router();
const cafesController = require('../controllers/cafesController');
const cafesValidator = require('../middlewares/custom/validation/cafesValidator');
const authenticator = require('../middlewares/custom/authentication');

// 카페 등록
router.post(
  '/',
  authenticator.isLoggedIn,
  cafesValidator.createCafe,
  cafesController.createCafe
);

// 카페 검색
router.get('/search', cafesController.searchCafe);

// 카페 지도 리스트업
router.get('/map', cafesValidator.cafesInMap, cafesController.cafesInMap);
module.exports = router;
