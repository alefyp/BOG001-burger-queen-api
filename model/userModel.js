const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
// the unique option is not a validator
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      // eslint-disable-next-line no-useless-escape
      validator: (v) => /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v),
      message: (email) => `${email.value} is not a a valid email`,
    },
  },
  password: {
    type: String,
    required: true,
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
userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);
