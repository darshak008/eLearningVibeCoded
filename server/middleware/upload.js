const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const AppError = require('../utils/AppError');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const fileFilter = (allowedMimes) => (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`File type ${file.mimetype} is not allowed`, 400), false);
  }
};

const uploadToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(new AppError('Cloudinary upload failed', 500));
      else resolve(result);
    });
    Readable.from(buffer).pipe(uploadStream);
  });

const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
});

const uploadVideo = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: fileFilter(['video/mp4', 'video/quicktime', 'video/avi', 'video/webm']),
});

module.exports = { uploadImage, uploadVideo, uploadToCloudinary, cloudinary };
