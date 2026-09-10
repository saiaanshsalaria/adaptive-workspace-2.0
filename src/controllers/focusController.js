const service = require('../services/focusService');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.create = asyncHandler(async (req, res) => success(res, await service.create(req.user.id, req.body), 201));
exports.analytics = asyncHandler(async (req, res) => success(res, await service.analytics(req.user.id, req.query.days)));
