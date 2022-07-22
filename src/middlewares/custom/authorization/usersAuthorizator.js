exports.isAuthorizedUser = (req, res, next) => {
  const loginUserId = req.user.id;
  let requestedUserId = req.param.id;

  isNaN(requestedUserId)
    ? res.status(400).json({ message: '입력하신 정보를 확인해주세요.' })
    : (requestedUserId = Number(requestedUserId));

  loginUserId !== requestedUserId
    ? res.status(403).json({ message: '요청을 처리할 권한이 없습니다.' })
    : next();
};
