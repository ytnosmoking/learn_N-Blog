const mongoose = require('mongoose');

const CommentsScheme = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  content: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

CommentsScheme.static('getCommentsById', function (id) {
  return this.findOne({ _id: id });
});
CommentsScheme.static('getComments', function (postId) {
  return this.find({ postId });
});
CommentsScheme.static('deleteCommentsById', function (id) {
  return this.deleteOne({ _id: id });
});
const CommentsModel = mongoose.model('comments', CommentsScheme, 'comments');
module.exports = CommentsModel;
