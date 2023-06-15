const PostsModel = require('../models/posts');
const CommentsModel = require('../models/comments');
class Posts {
  constructor() {
    this.getInfoById = this.getInfoById.bind(this);
  }
  async addPv(id) {
    const res = await PostsModel.updateOne({ _id: id }, { $inc: { pv: 1 } });
    return res;
  }
  async getPosts(req, res, next) {
    const { query = {} } = req;
    try {
      const result = await PostsModel.find(query)
        // .populate({ path: 'author', model: 'user' })
        .populate('author')
        .sort({ _id: -1 });
      console.log(result);
      console.log(`get posts 1111`);
      const result2 = await Promise.all(
        result.map(function (post) {
          const { _id: postId } = post;
          return CommentsModel.countDocuments({ postId })
            .exec()
            .then(function (commentsCount) {
              post._doc.commentsCount = commentsCount;
              // return post;
              // console.log(`---- start`);
              // console.log(post.toObject());
              return post;
            });
        })
      );
      console.log(`-----`);
      console.log(result2);
      res.render('posts', {
        title: 'posts',
        // posts: result,
        posts: result2,
      });
    } catch (err) {
      next(err);
    }
  }
  async addPost(req, res, next) {
    const { _id: author } = req.session.user;
    const { title, content } = req.fields;

    // 校验参数
    try {
      if (!title.length) {
        throw new Error('请填写标题');
      }
      if (!content.length) {
        throw new Error('请填写内容');
      }
    } catch (e) {
      req.flash('error', e.message);
      return res.redirect('back');
    }

    const post = {
      author,
      title,
      content,
    };
    try {
      const result = await PostsModel.create(post);
      req.flash('success', '发表成功');
      // 发表成功后跳转到该文章页
      res.redirect(`/posts/${result._id}`);
    } catch (err) {
      next(err);
    }
  }

  async getInfoById(req, res, next) {
    const { postId } = req.params;
    try {
      console.log(111);
      const result = await Promise.all([
        PostsModel.findOne({ _id: postId }).populate('author'),
        // .populate({
        //   path: 'author',
        //   model: 'user',
        // }),
        CommentsModel.getComments(postId)
          .populate({ path: 'author', model: 'user' })
          .sort({ _id: 1 }),
        this.addPv(postId),
      ]);
      console.log(222);
      console.log(result);
      const post = result[0];
      const comments = result[1] || [];
      if (!post) {
        throw new Error('该文章不存在');
      }

      res.render('post', {
        title: 'getInfo',
        post: post,
        comments: comments,
      });
    } catch (err) {
      next(err);
    }
  }
  async getPostById(req, res, next) {
    const { postId } = req.params;
    const {
      user: { _id: author },
    } = req.session;
    try {
      const result = await PostsModel.findOne({ _id: postId }).populate({
        path: 'author',
        model: 'user',
      });
      if (!result) {
        throw new Error('该文章不存在');
      }
      if (author.toString() !== result.author._id.toString()) {
        throw new Error('权限不足');
      }
      res.render('edit', {
        post: result,
        title: 'this is edit',
      });
    } catch (err) {
      next(err);
    }
  }
  async updatePost(req, res, next) {
    const { postId } = req.params;
    const {
      user: { _id: author },
    } = req.session;
    const { title, content } = req.fields;

    // 校验参数
    try {
      if (!title.length) {
        throw new Error('请填写标题');
      }
      if (!content.length) {
        throw new Error('请填写内容');
      }
    } catch (e) {
      req.flash('error', e.message);
      return res.redirect('back');
    }

    try {
      const result = await PostsModel.findOne({ _id: postId }).populate({
        path: 'author',
        model: 'user',
      });
      if (!result) {
        throw new Error('该文章不存在');
      }
      if (author.toString() !== result.author._id.toString()) {
        throw new Error('权限不足');
      }
      const result2 = await PostsModel.updateOne(
        { _id: postId },
        { $set: { title, content } }
      );
      req.flash('success', '编辑文章成功');
      // 编辑成功后跳转到上一页
      res.redirect(`/posts/${postId}`);
    } catch (err) {
      next(err);
    }
  }

  async deleteById(req, res, next) {
    const postId = req.params.postId;
    const author = req.session.user._id;
    try {
      const result = await PostsModel.findOne({ _id: postId }).populate({
        path: 'author',
        model: 'user',
      });
      if (!result) {
        throw new Error('该文章不存在');
      }
      if (author.toString() !== result.author._id.toString()) {
        throw new Error('权限不足');
      }
      await PostsModel.deleteOne({ _id: postId });
      await CommentsModel.deleteMany({ postId });
      req.flash('success', '删除文章成功');
      // 删除成功后跳转到主页
      res.redirect('/posts');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new Posts();
