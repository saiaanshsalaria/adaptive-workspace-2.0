const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null, index: true },
  filename: { type: String, required: true, trim: true, maxlength: 255 },
  fileType: { type: String, enum: ['pdf', 'docx', 'txt', 'md'], required: true },
  size: { type: Number, required: true, min: 0 },
  extractedText: { type: String, default: '' },
  uploadDate: { type: Date, default: Date.now },
  processingStatus: { type: String, enum: ['uploaded', 'processing', 'completed', 'failed'], default: 'uploaded', index: true }
}, { versionKey: false });

documentSchema.index({ userId: 1, uploadDate: -1 });
documentSchema.set('toJSON', {
  transform: (document, returned) => {
    returned.id = returned._id.toString();
    if (returned.projectId) returned.projectId = returned.projectId.toString();
    delete returned._id;
    delete returned.userId;
  }
});

module.exports = mongoose.model('Document', documentSchema);
