const postsDao = require('../daos/postsDao');

exports.selectPosts = (userId, cafeId) => {
  const rows = postsDao.selectPosts(userId, cafeId);
  return rows;
};

// exports.selectPostsWithCafes = (queryString) => {};

// exports.selectPostsWithCafesOrderByLikes = (queryString) => {};

// exports.selectPostsWithCafesByStoredUser = (queryString) => {};

exports.createPost = async (postDTO) => {
  const postId = await postsDao.createPost(postDTO);
  return postId;
};

exports.createPhoto = async (photoDTO) => {
  const photoId = await postsDao.createPhoto(photoDTO);
  return photoId;
};

exports.createRate = async (rateDTO) => {
  const rateId = await postsDao.createRate(rateDTO);
  return rateId;
};
