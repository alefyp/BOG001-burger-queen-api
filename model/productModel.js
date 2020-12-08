const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  image: {
    type: String,
    require: true,
    validate: {
      // eslint-disable-next-line no-useless-escape
      validator: (v) => /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(v),
      message: (image) => `${image.value} is not a a valid URL`,
    },
  },
  type: {
    type: String,
    require: true,
  },
  dateEntry: {
    type: Date,
    require: true,
  },
});

productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Product', productSchema);
