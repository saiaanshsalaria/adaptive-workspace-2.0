const mongoose = require('mongoose');

const visionSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  durationSeconds: { type: Number, required: true, min: 1, max: 24 * 60 * 60 },
  sampleCount: { type: Number, required: true, min: 1, max: 100000 },
  averageLighting: { type: Number, min: 0, max: 100 },
  averagePosture: { type: Number, min: 0, max: 100 },
  lowConfidenceSeconds: { type: Number, min: 0, max: 24 * 60 * 60, default: 0 },
  breakSuggested: { type: Boolean, default: false },
  modelVersion: { type: String, required: true, maxlength: 64 }
}, { timestamps: true, versionKey: false });

visionSessionSchema.index({ userId: 1, createdAt: -1 });
visionSessionSchema.set('toJSON', {
  transform: (document, returned) => {
    returned.id = returned._id.toString();
    delete returned._id;
    delete returned.userId;
  }
});

module.exports = mongoose.model('VisionSession', visionSessionSchema);
