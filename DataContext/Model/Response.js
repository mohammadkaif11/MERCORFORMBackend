const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  ResponseId: {
    type: String,
    required: true,
  },
  FormId:{
    type: String,
    required: true,
  },
  UserId: {
    type: String,
    required: true,
  },
});

// Create the FormData model using the schema
const Response = mongoose.model('Response', responseSchema);

module.exports = Response;
