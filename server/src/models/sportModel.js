const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    unique: true,
    lowercase: true,
  },
  link: {
    type: String,
    required: [true, 'Please provide a link'],
  },

  diffculty: {
    type: String,
    enum: ['easy', 'meduim', 'hard'],
    required: [true, 'Please provide a diffculty'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  photo: {
    type: String,
    required: [true, 'Please provide a photo'],
  },
  steps: {
    type: [String],
    required: [true, 'Please provide a steps'],
  },
  colories: { type: Number, required: [true, 'Please provide a steps'] },
});

const Sport = mongoose.model('Sport', sportSchema);

module.exports = Sport;
