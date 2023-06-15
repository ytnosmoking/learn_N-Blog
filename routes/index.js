const BaseRouter = require('./base');
const UserRouter = require('./users');
const SignRouter = require('./signin');
const SignUpRouter = require('./signup');
const SignOutRouter = require('./signout');
const PostsRouter = require('./posts');
const CommentsRouter = require('./comments');

module.exports = (app) => {
  app.use('/', BaseRouter);
  app.use('/signin', SignRouter);
  app.use('/signup', SignUpRouter);
  app.use('/signout', SignOutRouter);
  app.use('/posts', PostsRouter);
  app.use('/user', UserRouter);
  app.use('/comments', CommentsRouter);
};
