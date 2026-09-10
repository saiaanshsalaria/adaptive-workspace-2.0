function validate(schema, location = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[location]);
    if (!result.success) return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: result.error.flatten() }
    });
    req[location] = result.data;
    next();
  };
}

module.exports = validate;
