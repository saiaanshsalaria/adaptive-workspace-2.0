const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/apiResponse');
const service = require('../services/documentService');
const { getFileType, extractText } = require('../utils/documentExtraction');

exports.create = asyncHandler(async (req, res) => {
  if (!req.file) return failure(res, 400, 'A document file is required', undefined, 'FILE_REQUIRED');
  const fileType = getFileType(req.file.originalname, req.file.mimetype);
  const item = await service.create(req.user.id, {
    projectId: req.body.projectId || null,
    filename: req.file.originalname,
    fileType,
    size: req.file.size,
    processingStatus: 'processing'
  });
  if (!item) return failure(res, 404, 'Project not found', undefined, 'RESOURCE_NOT_FOUND');
  try {
    item.extractedText = await extractText(fileType, req.file.buffer);
    item.processingStatus = 'completed';
    await item.save();
    return success(res, item, 201);
  } catch (error) {
    item.processingStatus = 'failed';
    await item.save();
    return failure(res, 422, 'Unable to extract text from document', undefined, 'EXTRACTION_FAILED');
  }
});

exports.list = asyncHandler(async (req, res) => success(res, await service.list(req.user.id)));
exports.get = asyncHandler(async (req, res) => {
  const item = await service.get(req.user.id, req.params.id);
  return item ? success(res, item) : failure(res, 404, 'Document not found', undefined, 'RESOURCE_NOT_FOUND');
});
exports.remove = asyncHandler(async (req, res) => {
  const item = await service.remove(req.user.id, req.params.id);
  return item ? success(res, null) : failure(res, 404, 'Document not found', undefined, 'RESOURCE_NOT_FOUND');
});
