const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const upload = require('../middlewares/package/multer');
const authenticator = require('../middlewares/custom/authentication');
const authorizator = require('../middlewares/custom/authorization/postsAuthorizator');
//const upload = require('../middlewares/package/multer');
const postsValidator = require('../middlewares/custom/validation/postsValidator');

//포스트 등록(생성)
router.post('/', postsValidator.createPost, postsController.createPost);

//포스트 조회(카페 id로 필터링해서 조회,9개 조회)(해당 카페에 대한 다른 포스팅 가져오기에서 사용)
router.get('/', postsValidator.readPosts, postsController.readPosts);

//메인화면 포스트 8개 조회(좋아요순,최근 일주일 이내)
router.get('/most-likes', postsController.readMostLikesPosts);

//포스트 상세 정보 조회
router.get('/:id', postsValidator.readPost, postsController.readPost);

// Authentication - 로그인 되어있는지 체크
// 이하 라우터들은 인증을 거치게 됨
router.use(authenticator.isLoggedIn);

//포스트 등록(생성)
router.post('/', postsValidator.createPost, postsController.createPost);

//포스트 좋아요
router.get('/:id/like', postsValidator.likePost, postsController.likePost);

//포스트 저장
router.get('/:id/store', postsValidator.storePost, postsController.storePost);

//포스트 사진 업로드
router.post(
  '/photo',
  postsController.uploadPhoto,
  postsController.uploadPhotoAfter
);

// Authorization - UD 권한이 있는지 체크
// 로그인된 사용자와 요청하는 파라미터가 같은지 체크
// 이하 라우터들은 인가을 거치게 됨

//포스트 수정
router.patch(
  '/:id',
  postsValidator.updatePost,
  authorizator.isAuthorizedUserPost,
  postsController.updatePost
);

//포스트 삭제
router.delete(
  '/:id',
  postsValidator.deletePost,
  authorizator.isAuthorizedUserPost,
  postsController.deletePost
);

module.exports = router;
