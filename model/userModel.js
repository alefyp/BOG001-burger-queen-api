const mongoose = require('mongoose');
// the unique option is not a validator
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    validate: {
      // eslint-disable-next-line no-useless-escape
      validator: (v) => /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v),
      message: (email) => `${email.value} is not a a valid email`,
    },
  },
  password: {
    type: String,
    require: true,
    minlength: 6,
  },
  roles: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
});

// Saved as 'users' collection with the referred schema
module.exports = mongoose.model('User', userSchema);
