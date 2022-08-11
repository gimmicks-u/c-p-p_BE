const postsDao = require('../daos/postsDao');
const { pool } = require('../db/mysql');
const upload = require('../middlewares/package/multer');

exports.createPost = async (postDTO, rateDTO, photoURLs) => {
  let result = null;
  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const postId = await postsDao.insertPost(postDTO, conn);
      const photoDTOs = photoURLs.map((photoURL) => [postId, photoURL]);
      await postsDao.insertRate({ id: postId, ...rateDTO }, conn);
      await postsDao.insertPhotos(photoDTOs, conn);
      await conn.commit();
      result = {
        id: postId,
        message: '게시물이 등록되었습니다',
        status: 201,
      };
    } catch (err) {
      console.log(err);
      await conn.rollback();
      result = { message: '입력 정보를 확인해주세요', status: 400 };
    } finally {
      conn.release();
    }
  } catch (err) {
    console.log('커넥션풀에서 커넥션 가져오기 오류');
    result = { message: '입력 정보를 확인해주세요', status: 400 };
  }
  return result;
};
exports.readPosts = async (cafeId) => {
  // const posts = await postsDao.selectPosts(cafeId);
  // const result = posts
  //   ? { rows: posts, status: 200 }
  //   : { message: '잘못된 요청입니다', status: 400 };
  // return result;
  try {
    const posts = await postsDao.selectPosts(cafeId);
    return { rows: posts, status: 200 };
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 400 };
  }
};

//userId는 현재 로그인된 사용자의 id임
exports.readPost = async (postId, userId) => {
  // const affectedRows = await postsDao.increaseViews(postId);
  // if (!affectedRows) {
  //   return isNaN(affectedRows)
  //     ? { message: '잘못된 요청입니다', status: 400 }
  //     : { message: '해당 포스트가 존재하지 않습니다', status: 404 };
  // }
  // try {
  //   const { writer, cafeId, ...post } = await postsDao.selectPost(
  //     postId,
  //     userId
  //   ); //객체
  //   //writer는 글 작성한 사람의 id
  //   console.log('writer:', writer);
  //   const rate = await postsDao.selectRate(postId); //객체
  //   const cafe = await postsDao.selectCafe(cafeId); //객체
  //   const photoURLs = await postsDao.selectPhotoURLs(postId); //객체배열
  //   const user = await postsDao.selectUser(writer); //
  //   //rate,cafe.... 변수들 중 하나라도 falsy한 값일 경우(query 오류 발생한경우)
  //   if (!rate || !cafe || !photoURLs || !user) {
  //     return { message: '잘못된 요청입니다', status: 400 };
  //   }
  //   const photoURLArr = photoURLs.map((photoURL) => photoURL.photoURL);
  //   return {
  //     ...post,
  //     rate,
  //     cafe,
  //     photoURLs: photoURLArr,
  //     user,
  //     status: 200,
  //   };
  // } catch (err) {
  //   return { message: '잘못된 요청입니다', status: 400 };
  // }
  try {
    const affectedRows = await postsDao.increaseViews(postId);
    if (!affectedRows) {
      return { message: '해당 포스트가 존재하지 않습니다', status: 404 };
    }
    const { writer, cafeId, ...post } = await postsDao.selectPost(
      postId,
      userId
    ); //객체
    //writer는 글 작성한 사람의 id
    console.log('writer:', writer);
    const rate = await postsDao.selectRate(postId); //객체
    const cafe = await postsDao.selectCafe(cafeId); //객체
    const photoURLs = await postsDao.selectPhotoURLs(postId); //객체배열
    const user = await postsDao.selectUser(writer); //
    const photoURLArr = photoURLs.map((photoURL) => photoURL.photoURL);

    return {
      ...post,
      rate,
      cafe,
      photoURLs: photoURLArr,
      user,
      status: 200,
    };
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 400 };
  }
};

exports.updatePost = async (postDTO, rateDTO, photoDTOs) => {
  let result = null;
  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await postsDao.updatePost(postDTO, conn);
      await postsDao.updateRate(rateDTO, conn);
      await postsDao.deletePhotos(postDTO.id, conn);
      await postsDao.insertPhotos(photoDTOs, conn);
      await conn.commit();
      result = {
        id: postDTO.id,
        message: '게시물이 수정되었습니다',
        status: 200,
      };
    } catch (err) {
      console.log(err);
      await conn.rollback();
      result = { message: '입력 정보를 확인해주세요', status: 400 };
    } finally {
      conn.release();
    }
  } catch (err) {
    console.log('커넥션풀에서 커넥션 가져오기 오류');
    result = { message: '입력 정보를 확인해주세요', status: 400 };
  }
  return result;
};

exports.deletePost = async (postId) => {
  // const affectedRows = await postsDao.deletePost(postId);
  // const result = affectedRows
  //   ? { message: '게시물이 삭제되었습니다', status: 200 }
  //   : typeof affectedRows === 'number'
  //   ? { message: '해당 게시물이 존재하지 않습니다', status: 404 }
  //   : { message: '잘못된 요청입니다', status: 404 };
  // return result;
  try {
    const affectedRows = await postsDao.deletePost(postId);
    const result = affectedRows
      ? { message: '게시물이 삭제되었습니다', status: 200 }
      : { message: '해당 게시물이 존재하지 않습니다', status: 404 };

    return result;
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 404 };
  }
};

exports.readMostLikesPosts = async () => {
  // const posts = await postsDao.selectMostLikesPosts();
  // const result = posts
  //   ? { rows: posts, status: 200 }
  //   : { message: '잘못된 요청입니다', status: 400 };
  // return result;
  try {
    const posts = await postsDao.selectMostLikesPosts();

    return { rows: posts, status: 200 };
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 400 };
  }
};

exports.likePost = async (postId, userId) => {
  try {
    //해당 포스트가 존재하는지 먼저 확인
    const isExist = await postsDao.isExistPost(postId);
    if (!isExist) {
      return { message: '해당 포스트가 존재하지 않습니다', status: 404 };
    }
    //해당 유저가 해당 포스트에 좋아요를 눌렀는지 확인
    const isLiked = await postsDao.isExistLike(postId, userId);
    //좋아요를 눌렀으면 해당 좋아요 삭제,안눌렀으면 좋아요 추가
    isLiked
      ? await postsDao.deleteLike(postId, userId)
      : await postsDao.insertLike(postId, userId);

    return { id: postId, message: '포스트 좋아요 요청 성공', status: 200 };
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 400 };
  }
};
exports.storePost = async (postId, userId) => {
  try {
    //해당 포스트가 존재하는지 먼저 확인
    const isExist = await postsDao.isExistPost(postId);
    if (!isExist) {
      return { message: '해당 포스트가 존재하지 않습니다', status: 404 };
    }
    //해당 유저가 해당 포스트를 저장하였는지 확인
    const isStored = await postsDao.isExistStoredPost(postId, userId);
    //저장했으면 저장 삭제, 저장 안했으면 저장
    isStored
      ? await postsDao.deleteStoredPost(postId, userId)
      : await postsDao.insertStoredPost(postId, userId);

    return { id: postId, message: '포스트 저장 요청 성공', status: 200 };
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 400 };
  }
};

exports.uploadPhoto = (req, res, next) => {
  try {
    upload.single('photo')(req, res, next);
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 400 };
  }
};
