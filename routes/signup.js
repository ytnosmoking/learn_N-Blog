const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const sha1 = require('sha1');
const { checkNotLogin } = require('../middlewares/check');
const UserModel = require('../models/user');

router.get('/', checkNotLogin, (req, res, next) => {
  res.render('signup', { title: '注册' });
});

router.post('/', checkNotLogin, (req, res, next) => {
  console.log(req.fields);
  console.log(req.files);
  const { name, gender, bio, repassword } = req.fields;
  let { password } = req.fields;
  console.log(req.files.avatar.path, path.sep);
  let avatar = req.files.avatar.path.split(path.sep).pop();
  console.log(avatar);
  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符');
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是 m、f 或 x');
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介请限制在 1-30 个字符');
    }
    if (!req.files.avatar.name) {
      throw new Error('缺少头像');
    }
    if (password.length < 6) {
      throw new Error('密码至少 6 个字符');
    }
    if (password !== repassword) {
      throw new Error('两次输入密码不一致');
    }
  } catch (e) {
    // 注册失败，异步删除上传的头像
    fs.unlink(req.files.avatar.path, (err) => {
      console.log('remove files path');
      console.log(err);
    });
    req.flash('error', e.message);
    return res.redirect('/signup');
  }
  password = sha1(password);
  let user = {
    name,
    password,
    gender,
    bio,
    avatar,
  };
  UserModel.create(user)
    .then((result) => {
      console.log(` create user`);
      console.log(result);
      console.log(result.ops);
      // user = result.ops[0];
      user = result;
      // 删除密码这种敏感信息，将用户信息存入 session
      delete user.password;
      req.session.user = user;
      // 写入 flash
      req.flash('success', '注册成功');
      // 跳转到首页
      res.redirect('/posts');
    })
    .catch((e) => {
      fs.unlink(req.files.avatar.path, (err) => {
        console.log(err);
      });
      // 用户名被占用则跳回注册页，而不是错误页
      if (e.message.match('duplicate key')) {
        req.flash('error', '用户名已被占用');
        return res.redirect('/signup');
      }
      next(e);
    });
});

module.exports = router;
