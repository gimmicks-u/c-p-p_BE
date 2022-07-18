const postsService = require('../services/postsService');

exports.selectPosts = (req, res, next) => {
  const userId = req.query.userId;
  const cafeId = req.qeury.cafeId;
  const posts = postsService.selectPosts(userId, cafeId);

  if (posts) res.json(posts);
  else res.status(404).json({ msg: '쿼리 실패', code: 404 });
};

exports.createPost = async (req, res) => {
  // dev : 현재는 userId를 body에서 가져오게 설정.
  // const { userId } = req.user.id;
  const {
    userId,
    content,
    visited,
    photoURLs,
    receiptURL,
    isSponsored,
    cafeId,
    rate,
  } = req.body;

  const postDTO = {
    userId,
    cafeId,
    content,
    visited,
    receiptURL,
    isSponsored,
  };

  const result = await postsService.createPost(postDTO, rate, photoURLs);
  const { status, ...response } = result;

  res.status(status).json(response);
};
