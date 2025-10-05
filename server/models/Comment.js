const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  likes: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});
commentSchema.index({ parentId: 1, timestamp: -1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;


