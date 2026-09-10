const Project = require('../models/Project');

const list = (userId, filters = {}) => Project.find({ userId, ...filters }).sort({ createdAt: -1 });
const get = (userId, id) => Project.findOne({ _id: id, userId });
const create = (userId, data) => Project.create({ ...data, userId });
const update = (userId, id, data) => Project.findOneAndUpdate({ _id: id, userId }, data, { new: true, runValidators: true });
const remove = (userId, id) => Project.findOneAndDelete({ _id: id, userId });

module.exports = { list, get, create, update, remove };
