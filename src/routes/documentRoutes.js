const router = require('express').Router();
const controller = require('../controllers/documentController');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const schemas = require('../validation/schemas');

router.post('/', upload.single('file'), validate(schemas.documentUpload, 'body'), controller.create);
router.get('/', controller.list);
router.get('/:id', validate(schemas.paramsId, 'params'), controller.get);
router.delete('/:id', validate(schemas.paramsId, 'params'), controller.remove);

module.exports = router;
