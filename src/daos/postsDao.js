const { pool } = require('../db/mysql');

exports.selectPosts = async (userId, cafeId) => {
  const query = null;
  const params = null;
  if (userId && cafeId) {
    query =
      'SELECT * FROM posts INNER JOIN photos on posts.id=photos.postId WHERE posts.userId=? AND posts.cafeId=? GROUP BY posts.id';
    params = [userId, cafeId];
  } else if (userId) {
    query =
      'SELECT * FROM posts INNER JOIN photos on posts.id=photos.postId WHERE posts.userId=? GROUP BY posts.id';
    params = [userId];
  } else if (cafeId) {
    query =
      'SELECT * FROM posts INNER JOIN photos on posts.id=photos.postId WHERE posts.cafeId=? GROUP BY posts.id';
    params = [cafeId];
  } else {
    query =
      'SELECT * FROM posts INNER JOIN photos on posts.id=photos.postId GROUP BY posts.id';
    params = [];
  }
  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(query, params);
      return rows;
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

// exports.selectPostsWithCafes = async (queryString) => {
//   const query = `SELECT * FROM posts INNER JOIN (SELECT postId,COUNT(userId) as "count" FROM likes GROUP BY postId) likesCount on posts.id=likesCount.postId INNER JOIN cafes on posts.cafeId=cafes.id`;

//   if ("userId" in queryString) {
//     query += " WHERE posts.userId = ?";
//   }
//   if ("cafeId" in queryString) {
//     query += query.contains("WHERE")
//       ? " AND posts.cafeId=?"
//       : " WHERE posts.cafeId = ?";
//   }

//   const params = [email, sha256(password + process.env.PASSWORD_SALT)];
//   try {
//     const conn = await pool.getConnection();
//     try {
//       const [rows] = await conn.query(query, params);
//       const user = rows[0];
//       return user;
//     } catch (err) {
//       console.log("selectUser QUERY 오류");
//       console.log(err);
//     } finally {
//       conn.release();
//     }
//   } catch (err) {
//     console.log("커넥션풀에서 커넥션 가져오기 오류");
//     console.log(err);
//   }
// };

exports.createPost = async (postDTO) => {
  const query = `
    INSERT INTO posts (userId, cafeId, content, visited, receiptURL, isSponsored) 
    VALUES(?, ?, ?, ?, ?, ?);
  `;
  const params = [
    postDTO.userId,
    postDTO.cafeId,
    postDTO.content,
    postDTO.visited,
    postDTO.receiptURL,
    postDTO.isSponsored,
  ];

  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(query, params);
      return result.insertId;
    } catch (err) {
      console.log('createPosts QUERY 오류');
      console.log(err);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.log('커넥션풀에서 커넥션 가져오기 오류');
    console.log(err);
  }
};

exports.createPhoto = async (photoDTO) => {
  const query = `
    INSERT INTO photos (postId, photoURL)
    VALUES ?;
  `;
  const params = [photoDTO];

  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(query, params);
      return result.insertId;
    } catch (err) {
      console.log('createPhoto QUERY 오류');
      console.log(err);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.log('커넥션풀에서 커넥션 가져오기 오류');
    console.log(err);
  }
};

exports.createRate = async (rateDTO) => {
  const query = `
    INSERT INTO rates (id, taste, vibe, service, parking, bathroom, amenity)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  const params = [
    rateDTO.postId,
    rateDTO.taste,
    rateDTO.vibe,
    rateDTO.service,
    rateDTO.parking,
    rateDTO.bathroom,
    rateDTO.amenity,
  ];

  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(query, params);
      return result.insertId;
    } catch (err) {
      console.log('createPhoto QUERY 오류');
      console.log(err);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.log('커넥션풀에서 커넥션 가져오기 오류');
    console.log(err);
  }
};
