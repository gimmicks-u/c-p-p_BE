exports.isAuthorizedUser = (req, res, next) => {
  const loginUserId = req.user.id;
  let requestedUserId = Number(req.params.id);
  console.log(loginUserId, requestedUserId);

  loginUserId !== requestedUserId
    ? res.status(403).json({ message: '요청을 처리할 권한이 없습니다.' })
    : next();
};
