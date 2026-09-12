const router = require('express').Router();
const controller = require('../controllers/visionController');
const validate = require('../middleware/validate');
const schemas = require('../validation/schemas');

router.get('/analytics', validate(schemas.analyticsQuery, 'query'), controller.analytics);
router.post('/sessions', validate(schemas.visionSession, 'body'), controller.create);

module.exports = router;
