const { pool } = require('../db/mysql');
const sha256 = require('sha256');

exports.selectUser = async (email, password) => {
  const query =
    "SELECT id,nickname,profileURL,provider FROM users WHERE email=? AND password=? AND provider='local'";
  const params = [email, sha256(password + process.env.PASSWORD_SALT)];
  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(query, params);
      const user = rows[0];
      return user;
    } catch (err) {
      console.log('selectUser QUERY 오류');
      console.log(err);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.log('커넥션풀에서 커넥션 가져오기 오류');
    console.log(err);
  }
};

exports.selectUserBySnsId = async (snsId, provider) => {
  const query =
    'SELECT id,nickname,profileURL,provider FROM users where snsId = ? AND provider=?';
  const params = [snsId, provider];
  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(query, params);
      const user = rows[0];
      return user ? user : {};
    } catch (err) {
      console.log('selectUserBySnsId QUERY 오류');
      console.log(err);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.log('커넥션풀에서 커넥션 가져오기 오류');
    console.log(err);
  }
};
