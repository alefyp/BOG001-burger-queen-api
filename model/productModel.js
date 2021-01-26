const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    validate: {
      // eslint-disable-next-line no-useless-escape
      validator: (v) => /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(v),
      message: (image) => `${image.value} is not a a valid URL`,
    },
  },
  type: {
    type: String,
  },
  dateEntry: {
    type: Date,
  },
});

productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Product', productSchema);
