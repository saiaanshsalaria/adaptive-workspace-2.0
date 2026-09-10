function success(res, data, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

function failure(res, statusCode, message, details, code) {
  return res.status(statusCode).json({
    success: false,
    error: { code: code || `HTTP_${statusCode}`, message, ...(details === undefined ? {} : { details }) }
  });
}

module.exports = { success, failure };
