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

exports.checkNickname = async (nickname) => {
  const hasNickname = await usersDao.checkNickname(nickname);
  // 닉네임 존재하면 check = 1, 존재하지 않으면 0
  const result = hasNickname
    ? { message: '중복된 닉네임입니다', status: 400 }
    : { message: '사용할 수 있는 닉네임입니다', status: 200 };

  return result;
};

exports.checkEmail = async (email) => {
  const hasEmail = await usersDao.checkEmail(email);
  // 닉네임 존재하면 check = 1, 존재하지 않으면 0
  const result = hasEmail
    ? { message: '중복된 이메일입니다', status: 400 }
    : { message: '사용할 수 있는 이메일입니다', status: 200 };

  return result;
};
