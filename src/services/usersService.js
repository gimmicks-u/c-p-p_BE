const usersDao = require('../daos/usersDao');

exports.signUpLocal = async (userDTO) => {
  const insertId = await usersDao.createUser(userDTO);
  const result = insertId
    ? { id: insertId, message: '회원가입이 완료되었습니다.', status: 200 }
    : { message: '입력하신 정보를 다시한번 확인해주세요.', status: 400 };

  return result;
};
