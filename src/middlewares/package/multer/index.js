const multer = require('multer');
const storage = require('../../../../config/multer/config');

const upload = multer({ storage: storage });

module.exports = upload;
