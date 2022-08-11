exports.isLoggedIn = (req, res, next) => {
  req.isAuthenticated()
    ? next()
    : res.status(401).json({ message: '로그인된 사용자가 아닙니다.' });
};

exports.isNotLoggedIn = (req, res, next) => {
  req.isAuthenticated()
    ? res.status(400).json({ message: '이미 로그인 되어있습니다' })
    : next();
};
