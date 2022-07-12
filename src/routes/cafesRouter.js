const express = require('express');
const router = express.Router();
const cafesController = require('../controllers/cafesController');

router.post('/', cafesController.createCafe);
module.exports = router;
