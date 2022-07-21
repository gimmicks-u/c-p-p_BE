const { pool } = require('../db/mysql');

exports.insertPost = async (postDTO, conn) => {
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
    const [result] = await conn.query(query, params);
    return result.insertId;
  } catch (err) {
    console.log('insertPost QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};

exports.insertRate = async (rateDTO, conn) => {
  const query = `
    INSERT INTO rates (id, taste, vibe, service, parking, bathroom, amenity)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  const params = [
    rateDTO.id,
    rateDTO.taste,
    rateDTO.vibe,
    rateDTO.service,
    rateDTO.parking,
    rateDTO.bathroom,
    rateDTO.amenity,
  ];

  try {
    const [result] = await conn.query(query, params);
    return result.insertId;
  } catch (err) {
    console.log('insertRate QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};

exports.selectPosts = async (cafeId) => {
  const query = `SELECT posts.id,posts.cafeId,posts.userId,users.nickname,users.profileURL,photos.photoURL
  FROM posts INNER JOIN 
  users on posts.userId=users.id INNER JOIN 
  photos on posts.id=photos.postId WHERE posts.cafeId = ? AND posts.deletedAt is NULL GROUP BY posts.id LIMIT 9`;
  const params = [cafeId];

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(query, params);
    return rows;
  } catch (err) {
    console.log('selectPosts QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};

exports.increaseViews = async (postId) => {
  const query = `UPDATE posts set views=views+1 where id = ? AND deletedAt is NULL`;
  const params = [postId];

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(query, params);
    return result.affectedRows;
  } catch (err) {
    console.log('increaseViews QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};
exports.selectPost = async (postId, userId) => {
  const query = `SELECT id,userId as "writer",cafeId,content,views,DATE_FORMAT(visited,'%Y-%m-%d') as visited,receiptURL,isSponsored,
  (SELECT EXISTS (SELECT id from likes WHERE userId = ? AND postId = ?)) as "isLiked",
  (SELECT EXISTS (SELECT id from storedPosts WHERE userId = ? AND postId = ?)) as "isStored",
  ifnull(A.likes,0) as "likes"
  FROM posts LEFT JOIN (SELECT postId,count(userId) as "likes" from likes GROUP BY postId) A
  ON posts.id = A.postId WHERE posts.id=? AND posts.deletedAt is NULL`;
  const params = [userId, postId, userId, postId, postId];

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(query, params);
    const row = rows[0];
    //isLiked프로퍼티와 isStored 프로퍼티의 값이 0이면 false로 1이면 true로 변환
    if (row) {
      row['isSponsored'] = row['isSponsored'] ? true : false;
      row['isLiked'] = row['isLiked'] ? true : false;
      row['isStored'] = row['isStored'] ? true : false;
    }
    // return row ? row : {};
    return row;
  } catch (err) {
    console.log('selectPost QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};

exports.selectRate = async (postId) => {
  const query = `SELECT taste,vibe,service,parking,bathroom,amenity FROM rates
  WHERE id = ?`;
  const params = [postId];

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(query, params);
    const row = rows[0];
    // return row ? row : {};
    return row;
  } catch (err) {
    console.log('selectPost QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};

exports.selectCafe = async (cafeId) => {
  const query = `SELECT id,name,address,phone,openingHours FROM cafes
  WHERE id = ?`;
  const params = [cafeId];

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(query, params);
    const row = rows[0];
    // return row ? row : {};
    return row;
  } catch (err) {
    console.log('selectCafe QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};

exports.selectPhotoURLs = async (postId) => {
  const query = `SELECT photoURL FROM photos
  WHERE postId = ?`;
  const params = [postId];

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(query, params);
    return rows;
  } catch (err) {
    console.log('selectPhotoURLs QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};

exports.selectUser = async (userId) => {
  const query = `SELECT id,nickname,profileURL FROM users
  WHERE id = ? AND deletedAt is NULL`;
  const params = [userId];

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(query, params);
    const row = rows[0];
    // return row ? row : {};
    return row;
  } catch (err) {
    console.log('selectUser QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};
exports.updatePost = async (postDTO, conn) => {
  const query = `UPDATE posts set content=ifnull(?,content),visited=ifnull(?,visited)
  ,receiptURL=?,isSponsored=ifnull(?,isSponsored),cafeId=ifnull(?,cafeId) WHERE id=? AND deletedAt is NULL`;
  const params = [
    postDTO.content,
    postDTO.visited,
    postDTO.receiptURL,
    postDTO.isSponsored,
    postDTO.cafeId,
    postDTO.id,
  ];
  try {
    const [result] = await conn.query(query, params);
    return result;
  } catch (err) {
    console.log('updatePost QUERY 오류');
    console.log(err);
    throw err;
  }
};

exports.updateRate = async (rateDTO, conn) => {
  const query = `UPDATE rates set taste=ifnull(?,taste),vibe=ifnull(?,vibe),service=ifnull(?,service)
  ,parking=ifnull(?,parking),bathroom=ifnull(?,bathroom),amenity=ifnull(?,amenity)    
  WHERE id=?`;
  const params = [
    rateDTO.taste,
    rateDTO.vibe,
    rateDTO.service,
    rateDTO.parking,
    rateDTO.bathroom,
    rateDTO.amenity,
    rateDTO.id,
  ];

  try {
    const [result] = await conn.query(query, params);
    return result;
  } catch (err) {
    console.log('updateRate QUERY 오류');
    console.log(err);
    throw err;
  }
};
exports.deletePhotos = async (postId, conn) => {
  const query = `DELETE FROM photos WHERE postId=?`;
  const params = [postId];

  try {
    await conn.query(query, params);
  } catch (err) {
    console.log('deletePhotos QUERY 오류');
    console.log(err);
    throw err;
  }
};

exports.insertPhotos = async (photoDTOs, conn) => {
  const query = `INSERT INTO photos (postId, photoURL)
    VALUES ?`;
  const params = [photoDTOs];

  try {
    await conn.query(query, params);
  } catch (err) {
    console.log('insertPhotos QUERY 오류');
    console.log(err);
    throw err;
  }
};

exports.deletePost = async (postId) => {
  const query = `UPDATE posts set deletedAt=CURRENT_TIMESTAMP where id = ? AND deletedAt IS NULL`;
  const params = [postId];

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(query, params);
    return result.affectedRows;
  } catch (err) {
    console.log('deletePost QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};

exports.selectMostLikesPosts = async () => {
  const query = `SELECT * FROM
  (SELECT posts.id,A.photoURL,users.id as "userId",users.nickname,users.profileURL,cafes.id as "cafeId",cafes.name as "cafeName",ifnull(B.likes,0) as "likes"
  FROM posts INNER JOIN
  (SELECT postId,photoURL from photos GROUP BY postId) A ON posts.id=A.postId LEFT JOIN
  (SELECT postId,count(userId) as "likes" from likes GROUP BY postId) B ON posts.id=B.postId INNER JOIN
  users ON posts.userId = users.id INNER JOIN
  cafes ON posts.cafeId = cafes.id WHERE posts.createdAt > CURRENT_TIMESTAMP + INTERVAL -7 DAY AND posts.deletedAt IS NULL ORDER BY B.likes DESC LIMIT 18446744073709551615) C GROUP BY cafeId ORDER BY NULL LIMIT 8;`;

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(query);
    return rows;
  } catch (err) {
    console.log('selectMostLikesPosts QUERY 오류');
    console.log(err);
  } finally {
    conn.release();
  }
};
exports.isExistPost = async (postId) => {
  const query = `SELECT EXISTS (SELECT id from posts WHERE id = ? AND deletedAt is NULL) as "exist"`;
  const params = [postId];

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(query, params);
    return rows[0].exist;
  } catch (err) {
    console.log('isExistPost QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};
exports.isExistLike = async (postId, userId) => {
  const query = `SELECT EXISTS (SELECT id from likes WHERE postId = ? AND userId = ?) as "exist"`;
  const params = [postId, userId];

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(query, params);
    return rows[0].exist;
  } catch (err) {
    console.log('isExistLike QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};
exports.deleteLike = async (postId, userId) => {
  const query = `DELETE FROM likes WHERE postId =? AND userId = ?`;
  const params = [postId, userId];

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(query, params);
    return result.affectedRows;
  } catch (err) {
    console.log('deleteLike QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};
exports.insertLike = async (postId, userId) => {
  const query = `INSERT INTO likes (postId,userId) VALUES(?,?)`;
  const params = [postId, userId];

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(query, params);
    return result.insertId;
  } catch (err) {
    console.log('insertLike QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};

exports.isExistStoredPost = async (postId, userId) => {
  const query = `SELECT EXISTS (SELECT id from storedPosts WHERE postId = ? AND userId = ?) as "exist"`;
  const params = [postId, userId];

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(query, params);
    return rows[0].exist;
  } catch (err) {
    console.log('isExistStoredPost QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};
exports.deleteStoredPost = async (postId, userId) => {
  const query = `DELETE FROM storedPosts WHERE postId =? AND userId = ?`;
  const params = [postId, userId];

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(query, params);
    return result.affectedRows;
  } catch (err) {
    console.log('deleteStoredPost QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};
exports.insertStoredPost = async (postId, userId) => {
  const query = `INSERT INTO storedPosts (postId,userId) VALUES(?,?)`;
  const params = [postId, userId];

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(query, params);
    return result.insertId;
  } catch (err) {
    console.log('insertStoredPost QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
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
    VALUES ?
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
