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
