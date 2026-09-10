const service = require('../services/projectService');
const { success, failure } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.status) filters.status = req.query.status;
  if (req.query.priority) filters.priority = req.query.priority;
  if (req.query.search) filters.name = new RegExp(req.query.search, 'i');
  return success(res, await service.list(req.user.id, filters));
});
exports.get = asyncHandler(async (req, res) => { const item = await service.get(req.user.id, req.params.id); return item ? success(res, item) : failure(res, 404, 'Project not found'); });
exports.create = asyncHandler(async (req, res) => success(res, await service.create(req.user.id, req.body), 201, 'Project created'));
exports.update = asyncHandler(async (req, res) => { const item = await service.update(req.user.id, req.params.id, req.body); return item ? success(res, item, 200, 'Project updated') : failure(res, 404, 'Project not found'); });
exports.remove = asyncHandler(async (req, res) => { const item = await service.remove(req.user.id, req.params.id); return item ? success(res, null) : failure(res, 404, 'Project not found', undefined, 'RESOURCE_NOT_FOUND'); });
