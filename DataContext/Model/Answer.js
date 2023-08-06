const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  UserEmail: {
    type: String,
    required: true,
  },
  FormData: {
    type: String,
    required: true,
  },
  ResponseId: {
    type: String,
    required: true,
  },
  CreatedDate: {
    type: Date,
    default: Date.now,
  },
  UpdatedDate: {
    type: Date,
    default: Date.now,
  }
});

// Create the FormData model using the schema
const Answers = mongoose.model('Answers', answerSchema);

module.exports = Answers;
