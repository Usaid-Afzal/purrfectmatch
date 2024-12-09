// src/middleware/multerMiddleware.js
const multer = require('multer');

// We store files in memory first, and then upload them to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
