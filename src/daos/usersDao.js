const { pool } = require('../db/mysql');
const sha256 = require('sha256');

exports.createUser = async (userDTO) => {
  const query =
    'INSERT INTO users (email,password,name,birth,nickname,profileURL,provider,snsId) VALUES(?,?,?,?,?,?,?,?)';
  const params = [
    userDTO.email,
    userDTO.password
      ? sha256(userDTO.password + process.env.PASSWORD_SALT)
      : null,
    userDTO.name,
    userDTO.birth,
    userDTO.nickname,
    userDTO.profileURL,
    userDTO.provider,
    userDTO.snsId,
  ];
  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(query, params);
      // console.log(result);
      return result.insertId;
    } catch (err) {
      console.log('createUser QUERY 오류');
      console.log(err);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.log('커넥션풀에서 커넥션 가져오기 오류');
    console.log(err);
  }
};

exports.updateUser = async (userDTO) => {
  const query = `
    UPDATE users 
    SET nickname=ifnull(?, nickname), password=ifnull(?, password), profileURL=ifnull(?, profileURL) 
    WHERE id=?;
  `;
  const params = [
    userDTO.nickname,
    userDTO.password
      ? sha256(userDTO.password + process.env.PASSWORD_SALT)
      : null,
    userDTO.profileURL,
    userDTO.id,
  ];
  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(query, params);
      // console.log(result);
      return result.changedRows;
    } catch (err) {
      console.log('updateUser QUERY 오류');
      console.log(err);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.log('커넥션풀에서 커넥션 가져오기 오류');
    console.log(err);
  }
};

exports.getPasswordInDB = async (userDTO) => {
  const query = `
    SELECT password
    FROM users
    WHERE id=?
  `;
  const params = [userDTO.id];
  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(query, params);
      return rows[0].password;
    } catch (err) {
      console.log('getPasswordInDB QUERY 오류');
      console.log(err);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.log('커넥션풀에서 커넥션 가져오기 오류');
    console.log(err);
  }
};

exports.deleteUser = async (userDTO) => {
  // sql에서 비밀번호 검증시 사용할 쿼리
  // const query = `
  //   SELECT password INTO @pswd users WHERE id=? LIMIT 1;
  //   UPDATE users
  //   SET deletedAt= if(@pswd=?, now(), null)
  //   WHERE id=?;
  // `;
  const query = `
    UPDATE users
    SET deletedAt = now()
    where id=?
  `;
  const params = [userDTO.id];
  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(query, params);
      // console.log(result);
      return result.changedRows;
    } catch (err) {
      console.log('deleteUser QUERY 오류');
      console.log(err);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.log('커넥션풀에서 커넥션 가져오기 오류');
    console.log(err);
  }
};

exports.checkNickname = async (nickname) => {
  const query = `
  SELECT EXISTS
  (
    SELECT id FROM users WHERE nickname=?
  ) AS success;
  `;
  const params = [nickname];
  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(query, params);
      return result[0].success;
    } catch (err) {
      console.log('checkNickname QUERY 오류');
      console.log(err);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.log('커넥션풀에서 커넥션 가져오기 오류');
    console.log(err);
  }
};

exports.checkEmail = async (email) => {
  const query = `
  SELECT EXISTS
  (
    SELECT id FROM users WHERE email=?
  ) AS success;
  `;
  const params = [email];
  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(query, params);
      return result[0].success;
    } catch (err) {
      console.log('checkEmail QUERY 오류');
      console.log(err);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.log('커넥션풀에서 커넥션 가져오기 오류');
    console.log(err);
  }
};
