const postsService = require("../services/postsService");

exports.selectPosts = (req, res, next) => {
  const userId = req.query.userId;
  const cafeId = req.qeury.cafeId;
  const posts = postsService.selectPosts(userId, cafeId);

  if (posts) res.json(posts);
  else res.status(404).json({ msg: "쿼리 실패", code: 4004 });
};
