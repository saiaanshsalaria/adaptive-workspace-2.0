const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 5000, default: '' },
  status: { type: String, enum: ['todo', 'in_progress', 'blocked', 'completed'], default: 'todo', index: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium', index: true },
  deadline: { type: Date, default: null },
  estimatedDuration: { type: Number, min: 0, default: null },
  actualDuration: { type: Number, min: 0, default: null },
  tags: { type: [String], default: [] }
}, { timestamps: true, versionKey: false });

taskSchema.index({ userId: 1, projectId: 1, status: 1 });
taskSchema.set('toJSON', {
  transform: (document, returned) => {
    returned.id = returned._id.toString();
    if (returned.projectId) returned.projectId = returned.projectId.toString();
    delete returned._id;
    delete returned.userId;
  }
});
module.exports = mongoose.model('Task', taskSchema);
