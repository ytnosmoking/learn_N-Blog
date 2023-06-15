const mongoose = require('mongoose');

const PostScheme = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'user',
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  pv: { type: Number, default: 0 },
});

const PostsModel = mongoose.model('post', PostScheme);
module.exports = PostsModel;
