var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
var path = require('path');
var cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('config-lite')(__dirname);
const formidable = require('express-formidable');
const routes = require('./routes');
const pkg = require('./package');
require('./db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    name: config.session.key,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: config.session.maxAge,
    },
    store: MongoStore.create({
      mongoUrl: config.mongodb,
    }),
  })
);
app.use(flash());
app.use(
  formidable({
    uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
    keepExtensions: true, // 保留后缀
  })
);

// 设置模板全局常量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description,
};
// 添加模板必需的三个变量
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});
routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  req.flash('error', err.message);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
