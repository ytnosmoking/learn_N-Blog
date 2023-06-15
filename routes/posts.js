const express = require('express');
const router = express.Router();

const PostsController = require('../controllers/posts');
const { checkLogin } = require('../middlewares/check');

router.get('/', PostsController.getPosts);
router.post('/create', checkLogin, PostsController.addPost);
router.get('/create', checkLogin, (req, res, next) => {
  res.render('create', { title: 'this is create' });
});
router.get('/:postId', PostsController.getInfoById);
router.get('/:postId/edit', checkLogin, PostsController.getPostById);
router.post('/:postId/edit', checkLogin, PostsController.updatePost);
router.get('/:postId/remove', checkLogin, PostsController.deleteById);

module.exports = router;
