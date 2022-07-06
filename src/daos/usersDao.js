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

exports.selectUser = async (userId) => {
  const query = `SELECT id,email,name,birth,nickname,
  profileURL,provider,snsId,createdAt,updatedAt 
  FROM users`;

  const params = [userId];
  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(query, params);
      const row = rows[0];
      return row ? row : {};
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
