const usersDao = require('../daos/usersDao');
const sha256 = require('sha256');
const upload = require('../middlewares/package/multer');

exports.deleteProfilePhoto = async (userId) => {
  try {
    const changedRows = await usersDao.deleteProfilePhoto(userId);

    // 프로필 사진이 이미 Null일 경우 - changedRows=0
    if (!changedRows) {
      return { message: '삭제할 프로필 사진이 없습니다.', status: 400 };
    }
    return { message: '프로필 사진이 삭제되었습니다.', status: 200 };
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 400 };
  }
};

exports.signUpLocal = async (userDTO) => {
  try {
    // 중복 검사
    const hasEmail = await usersDao.checkEmail(userDTO.email);
    const hasNickname = await usersDao.checkNickname(userDTO.nickname);
    // 존재하면 1, 없으면 0
    if (hasEmail || hasNickname) {
      return { message: '입력하신 정보를 확인해주세요.', status: 400 };
    }

    const insertId = await usersDao.createUser(userDTO);
    return { id: insertId, message: '회원가입이 완료되었습니다.', status: 200 };
  } catch (err) {
    console.log(err);
    return { message: '입력하신 정보를 확인해주세요.', status: 400 };
  }
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
};

exports.updateUser = async (userDTO) => {
  try {
    const changedRows = await usersDao.updateUser(userDTO);
    const result = changedRows
      ? {
          id: userDTO.id,
          message: '회원 정보가 수정되었습니다.',
          status: 200,
        }
      : { message: '입력하신 정보를 확인해주세요.', status: 400 };

    return result;
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 400 };
  }
};

exports.deleteUser = async (userDTO, req) => {
  try {
    // 비밀번호 확인
    const passwordInDB = await usersDao.getPasswordInDB(userDTO);
    const isMatchedPassword =
      sha256(userDTO.password + process.env.PASSWORD_SALT) === passwordInDB;
    if (!isMatchedPassword) {
      return { message: '비밀번호가 일치하지 않습니다.', status: 401 };
    }
    // 유저 탈퇴
    const changedRows = await usersDao.deleteUser(userDTO);
    console.log(changedRows);
    if (!changedRows) {
      return { message: '해당 회원이 존재하지 않습니다.', status: 404 };
    }
    req.logout((err) => {
      if (err) {
        throw err;
      }
    });
    return { message: '회원 탈퇴되었습니다.', status: 200 };
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 400 };
  }
};

exports.checkNickname = async (nickname) => {
  try {
    const hasNickname = await usersDao.checkNickname(nickname);
    // 닉네임 존재하면 1, 존재하지 않으면 0
    const result = hasNickname
      ? { message: '중복된 닉네임입니다', status: 400 }
      : { message: '사용할 수 있는 닉네임입니다', status: 200 };

    return result;
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 400 };
  }
};

exports.checkEmail = async (email) => {
  try {
    const hasEmail = await usersDao.checkEmail(email);
    // 이메일 존재하면 1, 존재하지 않으면 0
    const result = hasEmail
      ? { message: '중복된 이메일입니다', status: 400 }
      : { message: '사용할 수 있는 이메일입니다', status: 200 };

    return result;
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 400 };
  }
};

exports.getUserPosts = async (userId) => {
  try {
    const userPosts = await usersDao.selectUserPosts(userId);

    return { userPosts, status: 200 };
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 400 };
  }
};

exports.getStoredPosts = async (userId) => {
  try {
    const storedPosts = await usersDao.selectStoredPosts(userId);

    return { storedPosts, status: 200 };
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 400 };
  }
};

exports.uploadPhoto = (req, res, next) => {
  try {
    upload.single('photo')(req, res, next);
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 400 };
  }
};
