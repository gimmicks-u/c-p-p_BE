const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/', usersController.signUpLocal);

router.get('/:id', usersController.selectUser);

module.exports = router;
