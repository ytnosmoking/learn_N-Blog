const mongoose = require('mongoose');
const config = require('config-lite')(__dirname);
const chalk = require('chalk');

mongoose.connect(config.mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// .then(() => {
//   console.log(chalk.green('数据库连结成功'));
// })
// .catch((error) => {
//   console.error(chalk.red('Error in MongoDb connection: ' + error));
// });

// mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open', () => {
  console.log(chalk.green('数据库连结成功'));
});

db.on('error', (error) => {
  console.error(chalk.red('Error in MongoDb connection: ' + error));
});

db.on('close', () => {
  console.log(chalk.red('数据库断开, 重新连结数据库'));
  mongoose.connect(config.mongodb, { server: { auto_reconnect: true } });
});

module.exports = db;
