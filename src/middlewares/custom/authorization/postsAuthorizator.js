const postsDao = require('../../../daos/postsDao');

exports.isAuthorizedUserPost = async (req, res, next) => {
  const loginUserId = req.user.id;
  const requestedPostId = req.params.id; // postId

  const result = await postsDao.selectUserIdByPostId(requestedPostId);
  console.log(typeof result);

  loginUserId !== result
    ? res.status(403).json({ message: '요청을 처리할 권한이 없습니다.' })
    : next();
};
