const usersDao = require('../daos/usersDao');

exports.signUpLocal = async (userDTO) => {
  const insertId = await usersDao.createUser(userDTO);
  const result = insertId
    ? { id: insertId, message: '회원가입이 완료되었습니다.', status: 200 }
    : { message: '입력하신 정보를 다시 한 번 확인해주세요.', status: 400 };

  return result;
};

exports.updateUser = async (userDTO) => {
  const changedRows = await usersDao.updateUser(userDTO);
  const result = changedRows
    ? { id: userDTO.id, message: '회원 정보가 수정되었습니다.', status: 200 }
    : { message: '입력하신 정보를 확인해주세요.', status: 400 };

  return result;
};

exports.checkPassword = async (userDTO) => {
  const passwordInDB = await usersDao.getPasswordInDB(userDTO);
  const isMatchedPassword = userDTO.password === parseInt(passwordInDB);
  const result = isMatchedPassword
    ? { message: '비밀번호가 일치하지 않습니다.', status: 400 }
    : {};
  return isMatchedPassword;
};

exports.deleteUser = async (userDTO) => {
  const changedRows = await usersDao.deleteUser(userDTO);
  const result = changedRows
    ? { id: userDTO.id, message: '회원 탈퇴되었습니다.', status: 200 }
    : { message: '입력하신 정보를 확인해주세요.', status: 400 };

  return result;
};
