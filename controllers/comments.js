const CommentsModel = require('../models/comments');

class CommentsController {
  constructor() {}

  async addComments(req, res, next) {
    const {
      user: { _id: author },
    } = req.session;
    const { postId, content } = req.fields;
    try {
      if (!content.length) {
        throw new Error('请填写留言内容');
      }
    } catch (e) {
      req.flash('error', e.message);
      return res.redirect('back');
    }

    const comment = {
      author,
      postId,
      content,
    };
    try {
      const result = await CommentsModel.create(comment);
      req.flash('success', '留言成功');
      // 留言成功后跳转到上一页
      res.redirect('back');
    } catch (err) {
      next(err);
    }
  }
  async deleteComments(req, res, next) {
    const {
      user: { _id: author },
    } = req.session;
    const { commentId } = req.params;
    try {
      const comment = await CommentsModel.getCommentsById(commentId);
      if (!comment) {
        throw new Error('留言不存在');
      }
      if (comment.author.toString() !== author.toString()) {
        throw new Error('没有权限删除留言');
      }
      await CommentsModel.deleteCommentsById(commentId);
      req.flash('success', '删除留言成功');
      // 删除成功后跳转到上一页
      res.redirect('back');
    } catch (err) {
      next(err);
    }
  }
  async getCommentsCount(postId) {
    return await CommentsModel.count({ postId });
  }
}

module.exports = new CommentsController();
