const { pool } = require('../db/mysql');
const sha256 = require('sha256');

exports.createCafe = async (cafeDTO) => {
  const query = `
    INSERT INTO cafes (name, address, lat, lng, phone, openingHours) 
    VALUES(?, ?, ?, ?, ?, ?)
  `;
  const params = [
    cafeDTO.name,
    cafeDTO.address,
    cafeDTO.lat,
    cafeDTO.lng,
    cafeDTO.phone,
    cafeDTO.openingHours,
  ];

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(query, params);
    return result.insertId;
  } catch (err) {
    console.log('createCafe QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};

exports.searchCafeName = async (keywordParams) => {
  const query = `
    SELECT t.id, t.name, t.address, t.postId
      FROM
      (
        SELECT cafes.id, name, address, posts.id AS "postId", max(posts.createdAt) AS createdAt
        FROM cafes
          INNER JOIN posts
            ON posts.cafeId=cafes.id
        WHERE name LIKE ? AND posts.deletedAt IS NULL
        GROUP BY cafes.id
      ) AS t
  `;
  const params = [keywordParams];

  const conn = await pool.getConnection();
  try {
    const [row] = await conn.query(query, params);
    return row;
  } catch (err) {
    console.log('searchCafeName QUERY 오류');
    console.log(err);
    throw err;
  } finally {
    conn.release();
  }
};

exports.searchCafeAddress = async (keywordParams) => {
  const query = `
    SELECT t.id, t.name, t.address, t.postId
      FROM
      (
        SELECT cafes.id, name, address, posts.id AS "postId", max(posts.createdAt) AS createdAt
        FROM cafes
          INNER JOIN posts
            ON posts.cafeId=cafes.id
        WHERE address LIKE ? AND posts.deletedAt IS NULL
        GROUP BY cafes.id
      ) AS t
  `;
  const params = [keywordParams];

  const conn = await pool.getConnection();
  try {
    const [row] = await conn.query(query, params);
    return row;
  } catch (err) {
    console.log('searchCafeAddress QUERY 오류');
    console.log(err);
  } finally {
    conn.release();
  }
};

exports.selectCafesInMap = async (currentMapRange) => {
  const query = `
  SELECT t.id, t.name, t.address, t.lat, t.lng, t.postId, t.photoURL 
    FROM 
    (
      SELECT cafes.id, cafes.name, cafes.address, cafes.lat, cafes.lng, posts.id AS postId, MAX(posts.createdAt) AS createdAt, photos.photoURL
      FROM cafes
        INNER JOIN posts
          ON cafes.id = posts.cafeId
        INNER JOIN photos
          ON photos.postId = posts.id
      WHERE cafes.lat > ? AND cafes.lat < ? AND cafes.lng > ? AND cafes.lng < ?
      GROUP BY cafes.id
    ) as t
  `;

  const params = [
    currentMapRange.swLat,
    currentMapRange.neLat,
    currentMapRange.swLng,
    currentMapRange.neLng,
  ];

  const conn = await pool.getConnection();
  try {
    const [row] = await conn.query(query, params);
    return row;
  } catch (err) {
    console.log('selectCafesInMap QUERY 오류');
    console.log(err);
  } finally {
    conn.release();
  }
};
