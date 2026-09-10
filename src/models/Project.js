const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, trim: true, maxlength: 2000, default: '' },
  status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active', index: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium', index: true },
  deadline: { type: Date, default: null },
  progress: { type: Number, min: 0, max: 100, default: 0 }
}, { timestamps: true, versionKey: false });

projectSchema.index({ userId: 1, status: 1, priority: 1 });
projectSchema.set('toJSON', {
  transform: (document, returned) => {
    returned.id = returned._id.toString();
    delete returned._id;
    delete returned.userId;
  }
});
module.exports = mongoose.model('Project', projectSchema);
