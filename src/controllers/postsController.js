const postsService = require('../services/postsService');

//포스트 생성
exports.createPost = async (req, res) => {
  const userId = req.user.id;

  const { cafeId, content, visited, receiptURL, isSponsored, photoURLs, rate } =
    req.body;

  const postDTO = {
    userId,
    cafeId,
    content,
    visited,
    receiptURL,
    isSponsored,
  };
  const rateDTO = { ...rate };
  // const photoURLs = photoURLs.map((photoURL) => photoURL);

  const result = await postsService.createPost(postDTO, rateDTO, photoURLs);

  const { status, ...response } = result;
  res.status(status).json(response);
};

//포스트 9개 요약정보 조회(해당 카페에 대한 다른 포스팅 가져오기에서 사용)
exports.readPosts = async (req, res) => {
  const cafeId = Number(req.query.cafeId);
  const result = await postsService.readPosts(cafeId);

  let { status, ...response } = result;
  response = 'rows' in response ? response.rows : response;
  res.status(status).json(response);
};

//포스트 상세 정보 조회
exports.readPost = async (req, res) => {
  // console.log('readPost');
  const postId = Number(req.params.id);
  const userId = req.user ? req.user.id : 0; //현재 로그인된 사용자의 id
  const result = await postsService.readPost(postId, userId);

  const { status, ...response } = result;
  res.status(status).json(response);
};

//포스트 수정
exports.updatePost = async (req, res) => {
  const postId = Number(req.params.id);
  const { content, visited, photoURLs, receiptURL, isSponsored, cafeId, rate } =
    req.body;
  const postDTO = {
    id: postId,
    content,
    visited,
    receiptURL,
    isSponsored,
    cafeId,
  };
  const rateDTO = { id: postId, ...rate };
  const photoDTOs = photoURLs.map((photoURL) => [postId, photoURL]);

  const result = await postsService.updatePost(postDTO, rateDTO, photoDTOs);
  const { status, ...response } = result;
  res.status(status).json(response);
};

//포스트 삭제
exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  const result = await postsService.deletePost(postId);

  const { status, ...response } = result;
  res.status(status).json(response);
};

//최근 일주일간 포스팅된 포스트중 가장 좋아요를 많이받은 포스트 8개 조회
//메인 페이지의 TODAY'S CPP PICK에서 사용할 것임
exports.readMostLikesPosts = async (req, res) => {
  const result = await postsService.readMostLikesPosts();

  let { status, ...response } = result;
  response = 'rows' in response ? response.rows : response;
  res.status(status).json(response);
};

//포스트 좋아요
exports.likePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  // const userId = 1;

  const result = await postsService.likePost(postId, userId);
  const { status, ...response } = result;
  res.status(status).json(response);
};

//포스트 저장
exports.storePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  // const userId = 1;

  const result = await postsService.storePost(postId, userId);
  const { status, ...response } = result;
  res.status(status).json(response);
};

//포스트 사진 업로드
exports.uploadPhoto = (req, res, next) => {
  //사진 업로드시 예외 발생 할 경우에만 함수가 리턴된다
  //현재 사진 업로드시 예외발생시에 그냥 400번대 코드가 응답으로 전송됨
  //해당 기능 추가 수정 필요
  const result = postsService.uploadPhoto(req, res, next);

  if (result) {
    const { status, ...response } = result;
    res.status(status).json(response);
  }
};
//포스트 사진 업로드 후 넘어오는 요청을 처리할 컨트롤러
exports.uploadPhotoAfter = (req, res) => {
  res
    .status(201)
    .json({ photoURL: req.file.location, message: '사진 업로드 완료' });
};
