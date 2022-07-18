const usersDao = require('../daos/usersDao');

exports.signUpLocal = async (userDTO) => {
  try {
    const insertId = await usersDao.createUser(userDTO);
    return { id: insertId, message: '회원가입이 완료되었습니다.', status: 200 };
  } catch (err) {
    console.log(err);
    return { message: '입력하신 정보를 다시한번 확인해주세요.', status: 400 };
  }

  // const result = insertId
  //   ? { id: insertId, message: '회원가입이 완료되었습니다.', status: 200 }
  //   : { message: '입력하신 정보를 다시한번 확인해주세요.', status: 400 };

  // return result;
};
exports.selectUser = async (userId) => {
  try {
    const user = await usersDao.selectUser(userId);
    const result = user
      ? { ...user, status: 200 }
      : { message: '해당 회원이 존재하지 않습니다', status: 404 };
    return result;
  } catch (err) {
    console.log(err);
    return { message: '잘못된 회원정보 요청', status: 400 };
  }
  // const user = await usersDao.selectUser(userId);
  // const result = user
  //   ? Object.keys(user).length > 0
  //     ? { ...user, status: 200 }
  //     : { message: '해당 회원이 존재하지 않습니다', status: 404 }
  //   : { message: '잘못된 회원정보 요청', status: 400 };
  // return result;
};
