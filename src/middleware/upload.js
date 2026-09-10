const multer = require('multer');
const env = require('../config/env');
const { getFileType } = require('../utils/documentExtraction');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.DOCUMENT_MAX_SIZE },
  fileFilter: (req, file, callback) => {
    if (!getFileType(file.originalname, file.mimetype)) {
      const error = new Error('Unsupported file type or MIME type');
      error.statusCode = 400;
      error.code = 'UNSUPPORTED_FILE_TYPE';
      return callback(error);
    }
    return callback(null, true);
  }
});

module.exports = upload;
