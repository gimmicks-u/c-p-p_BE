const cafesDao = require('../daos/cafesDao');
const haversine = require('haversine');

exports.createCafe = async (cafeDTO) => {
  const insertId = await cafesDao.createCafe(cafeDTO);
  const result = insertId
    ? { id: insertId, message: '카페가 등록되었습니다.', status: 201 }
    : { message: '잘못된 요청입니다.', status: 401 };

  return result;
};

exports.searchCafe = async (keyword) => {
  // 검색어가 입력되지 않았을 때
  if (!keyword) {
    return { message: '검색어를 입력해주세요', status: 404 }; // 상태코드?
  }

  const keywordParams = '%' + keyword + '%';

  try {
    const cafeListInName = await cafesDao.searchCafeName(keywordParams);
    const cafeListInAddress = await cafesDao.searchCafeAddress(keywordParams);
    const searchResult = {
      name: [...cafeListInName],
      address: [...cafeListInAddress],
      status: 200,
    };
    return searchResult;
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 400 };
  }
};

exports.cafesInMap = async (currentMapRange, currentLocation) => {
  // 위도, 경도가 잘못 입력되었을때
  if (
    !currentMapRange.swLat ||
    !currentMapRange.swLng ||
    !currentMapRange.neLat ||
    !currentMapRange.neLng
  ) {
    return { message: '현재 지도 정보를 불러올 수 없습니다.', status: 404 }; // 상태코드?
  }

  try {
    const cafeListInMap = await cafesDao.selectCafesInMap(currentMapRange);
    // 현위치에서 카페위치까지 거리 추가
    const cafeListWithDist = cafeListInMap.map((item) => {
      const cafeLocation = {
        latitude: item.lat,
        longitude: item.lng,
      };
      const distance = haversine(currentLocation, cafeLocation);
      return {
        ...item,
        distance,
      };
    });

    // 거리가 가까운 순으로 정렬
    cafeListWithDist.sort((a, b) => a.distance - b.distance);

    const result = {
      cafeListWithDist,
      status: 200,
    };
    return result;
  } catch (err) {
    console.log(err);
    return { message: '잘못된 요청입니다', status: 400 };
  }
};
