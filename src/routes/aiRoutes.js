const router = require('express').Router();
const controller = require('../controllers/aiController');
const validate = require('../middleware/validate');
const schemas = require('../validation/schemas');

router.post('/chat', validate(schemas.chat), controller.chat);

module.exports = router;
