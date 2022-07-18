const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const upload = require('../middlewares/package/multer');

//포스트 등록(생성)
router.post('/', postsController.createPost);

//포스트 조회(카페 id로 필터링해서 조회,9개 조회)(해당 카페에 대한 다른 포스팅 가져오기에서 사용)
router.get('/', postsController.readPosts);

//메인화면 포스트 8개 조회(좋아요순,최근 일주일 이내)
router.get('/most-likes', postsController.readMostLikesPosts);

//포스트 상세 정보 조회
router.get('/:id', postsController.readPost);

//포스트 수정
router.patch('/:id', postsController.updatePost);

//포스트 삭제
router.delete('/:id', postsController.deletePost);

//포스트 좋아요
router.get('/:id/like', postsController.likePost);

//포스트 저장
router.get('/:id/store', postsController.storePost);

//포스트 사진 업로드
router.post(
  '/photo',
  postsController.uploadPhoto,
  postsController.uploadPhotoAfter
);

module.exports = router;
