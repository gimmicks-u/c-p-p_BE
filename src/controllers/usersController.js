const { json } = require('express');
const usersService = require('../services/usersService');

exports.signUpLocal = async (req, res) => {
  const { email, password, nickname } = req.body;
  const userDTO = { email, password, nickname, provider: 'local' };

  const result = await usersService.signUpLocal(userDTO);
  const { status, ...response } = result;

  // 응답
  res.status(status);
  res.json(response);
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nickname, password, profileURL } = req.body;
  const userDTO = { id, nickname, password, profileURL };

  const result = await usersService.updateUser(userDTO);
  const { status, ...response } = result;
  // 응답
  res.status(status);
  res.json(response);
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const userDTO = { id, password };

  const result = await usersService.deleteUser(userDTO);
  const { status, ...response } = result;

  // 응답
  res.status(status);
  res.json(response);
};

exports.checkNickname = async (req, res) => {
  const nickname = req.query.nickname;

  const result = await usersService.checkNickname(nickname);
  const { status, ...response } = result;
  // 응답
  res.status(status);
  res.json(response);
};

exports.checkEmail = async (req, res) => {
  const email = req.query.email;

  const result = await usersService.checkEmail(email);
  const { status, ...response } = result;
  // 응답
  res.status(status);
  res.json(response);
};

exports.getUserPosts = async (req, res) => {
  const { id: userId } = req.params;

  const result = await usersService.getUserPosts(userId);
  const { status, userPosts, ...message } = result;
  // 응답
  res.status(status);
  userPosts ? res.json(userPosts) : res.json(message);
};

exports.getStoredPosts = async (req, res) => {
  const { id: userId } = req.params;

  const result = await usersService.getStoredPosts(userId);
  const { status, storedPosts, ...message } = result;
  // 응답
  res.status(status);
  storedPosts ? res.json(storedPosts) : res.json(message);
};
