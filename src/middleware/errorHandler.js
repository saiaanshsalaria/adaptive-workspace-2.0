const { failure } = require('../utils/apiResponse');

function notFound(req, res) {
  return failure(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err.name === 'ValidationError') {
    return failure(res, 400, 'Validation failed', Object.values(err.errors).map((e) => e.message), 'VALIDATION_ERROR');
  }
  if (err.name === 'CastError') return failure(res, 400, 'Invalid resource identifier', undefined, 'INVALID_IDENTIFIER');
  if (err.code === 11000) return failure(res, 409, 'Resource already exists', undefined, 'DUPLICATE_RESOURCE');
  if (err.code === 'LIMIT_FILE_SIZE') return failure(res, 413, 'File exceeds the maximum allowed size', undefined, 'FILE_TOO_LARGE');
  const status = err.statusCode || 500;
  if (status >= 500) console.error(err);
  return failure(res, status, status >= 500 ? 'Internal server error' : err.message, undefined, err.code || 'REQUEST_ERROR');
}

module.exports = { notFound, errorHandler };
