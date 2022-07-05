const postsDao = require('../daos/postsDao');

exports.selectPosts = (userId, cafeId) => {
  const rows = postsDao.selectPosts(userId, cafeId);
  return rows;
};

// exports.selectPostsWithCafes = (queryString) => {};

// exports.selectPostsWithCafesOrderByLikes = (queryString) => {};

// exports.selectPostsWithCafesByStoredUser = (queryString) => {};
