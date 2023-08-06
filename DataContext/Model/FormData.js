const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  UserId: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  FormData: {
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
  },
  Status: {
    type: Boolean,
    default: false,
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
  Start_Datetime: {
    type:Date,
    default: null,
    timestamps: false,
    timezone: 'utc'
  },
  End_Datetime: {
    type: Date,
    default: null,
    timestamps: false,
    timezone: 'utc'
  },
  Access: {
    type: [String],
    default: [],
  },
});

// Create the FormData model using the schema
const FormData = mongoose.model('FormData', formDataSchema);

module.exports = FormData;
