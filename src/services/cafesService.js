const cafesDao = require('../daos/cafesDao');

exports.createCafe = async (cafeDTO) => {
  const insertId = await cafesDao.createCafe(cafeDTO);
  const result = insertId
    ? { id: insertId, message: '카페가 등록되었습니다.', status: 201 }
    : { message: '잘못된 요청입니다.', status: 401 };

  return result;
};
