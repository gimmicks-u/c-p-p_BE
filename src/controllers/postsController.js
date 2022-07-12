const postsService = require('../services/postsService');

exports.selectPosts = (req, res, next) => {
  const userId = req.query.userId;
  const cafeId = req.qeury.cafeId;
  const posts = postsService.selectPosts(userId, cafeId);

  if (posts) res.json(posts);
  else res.status(404).json({ msg: '쿼리 실패', code: 404 });
};

exports.createPost = async (req, res) => {
  // const { userId } = req.cookie.id;
  const userId = 16;
  const { content, visited, photoURLs, receiptURL, isSponsored, cafeId, rate } =
    req.body;

  let postId;
  try {
    // 1. post
    const postDTO = {
      userId,
      cafeId,
      content,
      visited,
      receiptURL,
      isSponsored,
    };
    postId = await postsService.createPost(postDTO);

    // 2. photo
    // ex) photoDTO = [[postId, '1번 URL'], [postId, '2번 URL']...]
    const photoDTO = photoURLs.map((url) => [postId, url]);
    await postsService.createPhoto(photoDTO);

    // 3. rate
    const rateDTO = { postId, ...rate };
    await postsService.createRate(rateDTO);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.json({
      message: '입력 정보를 확인해주세요',
    });
  }

  res.status(201);
  res.json({
    id: postId,
    message: '게시물이 등록되었습니다.',
  });
};
