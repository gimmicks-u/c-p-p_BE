const cafesService = require('../services/cafesService');

// 카페 등록
exports.createCafe = async (req, res) => {
  const { name, address, lat, lng, phone, openingHours } = req.body;
  const cafeDTO = { name, address, lat, lng, phone, openingHours };

  const result = await cafesService.createCafe(cafeDTO);
  const { status, ...response } = result;

  // 응답
  res.status(status);
  res.json(response);
};

// 카페 검색
exports.searchCafe = async (req, res) => {
  const keyword = req.query.keyword;

  const result = await cafesService.searchCafe(keyword);
  const { status, ...response } = result;

  // 응답
  res.status(status);
  res.json(response);
};

// 카페 지도 리스트업
exports.cafesInMap = async (req, res) => {
  const currentMapRange = {
    swLng: parseFloat(req.query.swLng),
    swLat: parseFloat(req.query.swLat),
    neLng: parseFloat(req.query.neLng),
    neLat: parseFloat(req.query.neLat),
  };

  const currentLocation = {
    latitude: (currentMapRange.neLat + currentMapRange.swLat) / 2,
    longitude: (currentMapRange.neLng + currentMapRange.swLng) / 2,
  };

  const result = await cafesService.cafesInMap(
    currentMapRange,
    currentLocation
  );
  const { status, cafeListWithDist } = result;

  // 응답
  res.status(status);
  res.json(cafeListWithDist);
};
