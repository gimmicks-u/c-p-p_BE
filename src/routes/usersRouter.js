const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/', usersController.signUpLocal);
router.patch('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);
router.get('/nickname', usersController.checkNickname);
router.get('/email', usersController.checkEmail);
router.get('/:id/posts', usersController.getUserPosts);

module.exports = router;
