const express = require('express');
const router = express.Router();

const { checkLogin } = require('../middlewares/check');
const CommentsController = require('../controllers/comments');

router.post('/', checkLogin, CommentsController.addComments);
router.get('/:commentId/remove', checkLogin, CommentsController.deleteComments);

module.exports = router;
