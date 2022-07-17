const cafesService = require('../services/cafesService');

exports.createCafe = async (req, res) => {
  const { name, address, lat, lng, phone, openingHours } = req.body;
  const cafeDTO = { name, address, lat, lng, phone, openingHours };

  const result = await cafesService.createCafe(cafeDTO);
  const { status, ...response } = result;

  // 응답
  res.status(status);
  res.json(response);
};

exports.searchCafe = async (req, res) => {
  const keyword = req.query.keyword;

  const result = await cafesService.searchCafe(keyword);
  const { status, ...response } = result;

  // 응답
  res.status(status);
  res.json(response);
};

exports.cafesInMap = async (req, res) => {
  const currentMapRange = {
    swLng: parseInt(req.query.swLng),
    swLat: parseInt(req.query.swLat),
    neLng: parseInt(req.query.neLng),
    neLat: parseInt(req.query.neLat),
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
