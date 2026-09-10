const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const service = require('../ai/chatService');

exports.chat = asyncHandler(async (req, res) => success(res, await service.chat(req.body.message, req.user.id)));
