const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true },
  gender: { type: String, enum: ['m', 'f', 'x'], default: 'x' },
  bio: { type: String, required: true },
});

UserSchema.index({ name: 1 }, { unique: true });
UserSchema.static('findByName', function (name) {
  return this.findOne({ name });
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
