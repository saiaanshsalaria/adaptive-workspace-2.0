const Document = require('../models/Document');
const Project = require('../models/Project');

async function create(userId, data) {
  if (data.projectId) {
    const project = await Project.findOne({ _id: data.projectId, userId }).select('_id');
    if (!project) return null;
  }
  return Document.create({ ...data, userId });
}

const list = (userId) => Document.find({ userId }).sort({ uploadDate: -1 });
const get = (userId, id) => Document.findOne({ _id: id, userId });
const remove = (userId, id) => Document.findOneAndDelete({ _id: id, userId });

module.exports = { create, list, get, remove };
