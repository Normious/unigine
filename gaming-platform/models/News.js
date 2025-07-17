const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  publishedAt: {
    type: Date,
    required: true,
  },
  // Add other news-related fields here
});

module.exports = mongoose.model('News', newsSchema);
