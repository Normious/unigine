const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  episodes: [{
    title: String,
    url: String,
    duration: Number,
  }],
  // Add other podcast-related fields here
});

module.exports = mongoose.model('Podcast', podcastSchema);
