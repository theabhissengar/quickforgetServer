// const mongoose = require('mongoose');

// const secretSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: false,
//   },
//   expiresAt: {
//     type: Date,
//     required: true,
//   },
//   maxViews: {
//     type: Number,
//     required: true,
//   },
//   views: {
//     type: Number,
//     default: 0,
//   },
//   userId: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Index for expired secrets cleanup
// secretSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// module.exports = mongoose.model('Secret', secretSchema); 





const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  maxViews: {
    type: Number,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for expired secrets cleanup
secretSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Secret', secretSchema);