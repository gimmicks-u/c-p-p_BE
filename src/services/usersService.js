const userDao = require('../daos/usersDao');

exports.createUser = (userDTO) => {
  const result = userDao.createUser(userDTO);

  if (result) {
    return { status: 200, message: '회원 가입 성공' };
  } else {
    return { status: 400, message: '회원 가입 실패' };
  }
};

exports.selectUser = (userId) => {
  const row = userDao.selectUser(userId);
  // return row;
  if (row) {
    if (Object.keys(row) > 0) {
      return { status: 200, message: '회원 조회 성공' };
    } else {
      return { status: 404, message: '해당 id의 회원이 없습니다' };
    }
  } else {
    return { status: 400, message: '잘못된 요청입니다' };
  }
};
