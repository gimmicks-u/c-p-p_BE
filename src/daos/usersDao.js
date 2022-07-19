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
  FROM users WHERE id = ? AND deletedAt is NULL`;

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

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(query, params);
    // console.log(result);
    return result.changedRows;
  } catch (err) {
    console.log('updateUser QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};

exports.getPasswordInDB = async (userDTO) => {
  const query = `
    SELECT password
    FROM users
    WHERE id=?
  `;
  const params = [userDTO.id];

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(query, params);
    return rows[0].password;
  } catch (err) {
    console.log('getPasswordInDB QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};

exports.deleteUser = async (userDTO) => {
  const query = `
    UPDATE users
    SET deletedAt = now()
    where id=?
  `;
  const params = [userDTO.id];

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(query, params);
    // console.log(result);
    return result.changedRows;
  } catch (err) {
    console.log('deleteUser QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};

exports.checkNickname = async (nickname) => {
  const query = `
  SELECT EXISTS
  (
    SELECT id FROM users WHERE nickname=? AND deletedAt is NULL
  ) AS success;
  `;
  const params = [nickname];

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(query, params);
    return result[0].success;
  } catch (err) {
    console.log('checkNickname QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
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

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(query, params);
    return result[0].success;
  } catch (err) {
    console.log('checkEmail QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};

exports.selectUserPosts = async (userId) => {
  const query = `
  SELECT posts.id, photoURL, cafes.name AS cafeName, cafes.address AS cafeAddress
    FROM posts 
      INNER JOIN photos
        ON posts.id=photos.postId 
      INNER JOIN cafes
        ON posts.cafeId=cafes.id
          WHERE posts.userId=? AND posts.deletedAt is NULL
  GROUP BY posts.id
  `;
  const params = [userId];

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(query, params);
    return result;
  } catch (err) {
    console.log('selectUserPosts QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};

exports.selectStoredPosts = async (userId) => {
  const query = `
  SELECT storedPosts.postId, photoURL, cafes.name AS cafeName, cafes.address AS cafeAddress
    FROM storedPosts
      INNER JOIN posts
        ON posts.id = storedPosts.postId
      INNER JOIN photos
        ON photos.postId = storedPosts.postId
      INNER JOIN cafes
        ON cafes.id = posts.cafeId
          WHERE storedPosts.userId=? AND posts.deletedAt is NULL
  GROUP BY storedPosts.postId;
  `;
  const params = [userId];

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(query, params);
    return result;
  } catch (err) {
    console.log('selectStoredPosts QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};
