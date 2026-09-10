const mongoose = require('mongoose');

const focusSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  durationSeconds: { type: Number, required: true, min: 1, max: 24 * 60 * 60 },
  completed: { type: Boolean, default: false },
  startedAt: { type: Date, required: true },
  endedAt: { type: Date, required: true }
}, { timestamps: true, versionKey: false });

focusSessionSchema.index({ userId: 1, startedAt: -1 });
focusSessionSchema.set('toJSON', {
  transform: (document, returned) => {
    returned.id = returned._id.toString();
    delete returned._id;
    delete returned.userId;
  }
});

module.exports = mongoose.model('FocusSession', focusSessionSchema);
