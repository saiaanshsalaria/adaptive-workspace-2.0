const service = require('../services/taskService');
const { success, failure } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => success(res, await service.list(req.user.id, req.query)));
exports.get = asyncHandler(async (req, res) => { const item = await service.get(req.user.id, req.params.id); return item ? success(res, item) : failure(res, 404, 'Task not found'); });
exports.create = asyncHandler(async (req, res) => success(res, await service.create(req.user.id, req.body), 201, 'Task created'));
exports.update = asyncHandler(async (req, res) => { const item = await service.update(req.user.id, req.params.id, req.body); return item ? success(res, item, 200, 'Task updated') : failure(res, 404, 'Task not found'); });
exports.remove = asyncHandler(async (req, res) => { const item = await service.remove(req.user.id, req.params.id); return item ? success(res, null) : failure(res, 404, 'Task not found', undefined, 'RESOURCE_NOT_FOUND'); });
