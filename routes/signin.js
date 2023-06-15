var express = require('express');
const sha1 = require('sha1');
var router = express.Router();
const { checkNotLogin } = require('../middlewares/check');
const UserModel = require('../models/user');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('signin', { title: 'signin' });
});

router.post('/', checkNotLogin, function (req, res, next) {
  const { name = '', password = '' } = req.fields;
  try {
    if (!name.length) {
      throw new Error('请填写用户名');
    }
    if (!password.length) {
      throw new Error('请填写密码');
    }
    UserModel.findByName(name)
      .then(function (user) {
        if (!user) {
          console.log(`not- found`);
          console.log(user);
          req.flash('error', '用户不存在');
          return res.redirect('back');
        }
        // 检查密码是否匹配
        if (sha1(password) !== user.password) {
          req.flash('error', '用户名或密码错误');
          return res.redirect('back');
        }
        req.flash('success', '登录成功');
        // 用户信息写入 session
        delete user.password;
        req.session.user = user;
        // 跳转到主页
        res.redirect('/posts');
      })
      .catch(next);
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }
});

module.exports = router;
