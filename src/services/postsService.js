const postsDao = require('../daos/postsDao');

exports.selectPosts = (userId, cafeId) => {
  const rows = postsDao.selectPosts(userId, cafeId);
  return rows;
};

// exports.selectPostsWithCafes = (queryString) => {};

// exports.selectPostsWithCafesOrderByLikes = (queryString) => {};

// exports.selectPostsWithCafesByStoredUser = (queryString) => {};

exports.createPost_ = async (postDTO) => {
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

exports.createPost = async (postDTO, rate, photoURLs) => {
  try {
    // 1. db-posts 부분 등록
    const postId = await postsDao.createPost(postDTO);

    // 2. db-photos 부분 등록
    // ex) photoDTO = [[postId, '1번 URL'], [postId, '2번 URL']...]
    const photoDTO = photoURLs.map((url) => [postId, url]);
    const photosInsertId = await postsDao.createPhoto(photoDTO);

    // 3. db-rate 부분 등록
    const rateDTO = { postId, ...rate };
    const rateInsertId = await postsDao.createRate(rateDTO);

    return { id: postId, message: '게시물이 등록되었습니다.', status: 200 };
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 400 };
  }
};
