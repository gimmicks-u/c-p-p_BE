const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/', usersController.signUpLocal);
router.patch('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);
router.get('/nickname', usersController.checkNickname);
router.get('/email', usersController.checkEmail);
router.get('/:id/posts', usersController.getUserPosts);
router.get('/:id/stored-posts', usersController.getStoredPosts);

router.get('/:id', usersController.selectUser);

module.exports = router;
