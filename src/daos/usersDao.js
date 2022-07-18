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

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(query, params);
    console.log(result);
    return result.insertId;
  } catch (err) {
    console.log('createUser QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};

exports.selectUser = async (userId) => {
  const query = `SELECT id,email,name,birth,nickname,
  profileURL,provider,snsId,createdAt,updatedAt 
  FROM users`;

  const params = [userId];

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(query, params);
    const row = rows[0];
    return row;
  } catch (err) {
    console.log('createUser QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};
