const express = require('express');
const router = express.Router();
const cafesController = require('../controllers/cafesController');

// 카페 등록
router.post('/', cafesController.createCafe);

// 카페 검색
router.get('/search', cafesController.searchCafe);

// 카페 지도 리스트업
router.get('/map', cafesController.cafesInMap);
module.exports = router;
