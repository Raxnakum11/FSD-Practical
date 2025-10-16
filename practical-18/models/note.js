const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

noteSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

noteSchema.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Note', noteSchema);
