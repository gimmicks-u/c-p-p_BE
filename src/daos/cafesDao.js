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
  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(query, params);
      // console.log(result);
      return result.insertId;
    } catch (err) {
      console.log('createCafe QUERY 오류');
      console.log(err);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.log('커넥션풀에서 커넥션 가져오기 오류');
    console.log(err);
  }
};
