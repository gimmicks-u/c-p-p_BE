const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});

const storage = multerS3({
  s3: new AWS.S3(),
  bucket: process.env.BUCKET_NAME,
  key(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
  limit: { fileSize: 20 * 1024 * 1024 },
});

module.exports = storage;
