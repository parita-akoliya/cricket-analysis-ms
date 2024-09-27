import mongoose from 'mongoose';
import APIError from '../Utils/APIError';
import SuccessRes from '../Utils/SuccessRes';
const config = require('../Utils/config');
const httpStatus = require('http-status');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const customerModel = new Schema({
  name: {
    type: String,
    required: false,
    unique: false,
  },
  address: {
    type: String,
    required: false,
    unique: false,
  },
  gst: {
    type: String,
    required: false,
    unique: false,
  },
  updated_on: {
    type: String,
    required: false,
    unique: false,
  },
  created_on: {
    type: String,
    required: false,
    unique: false,
  },
  updated_by: {
    type: String,
    required: false,
    unique: false,
  },
  created_by: {
    type: String,
    required: false,
    unique: false,
  },
  emailAddress: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: false,
    unique: true,
    trim: true,
    lowercase: true,
  },
});
customerModel.statics = {
  getErrorMessage(error, errorType, data) {
    let apiError
    switch (errorType) {
      case 'MongoError':
        apiError = new APIError({
          message: 'Email Address Already Exists',
          data: data,
          status: httpStatus.CONFLICT,
        });
        break;
      case 'ValidationError':
        apiError = new APIError({
          message: error.message,
          data: data,
          status: httpStatus.CONFLICT,
        });
        break;
      default:
        apiError = new APIError({
          message: 'User not Registered',
          data: data,
          status: httpStatus.INTERNAL_SERVER_ERROR,
        });
        break;
    }
    return apiError;
  },
  sendSuccessResponse(data, msg, status) {
    return new SuccessRes({
      message: msg,
      data: data,
      status: status
    });
  },
  checkDuplicateEmail(error) {
    return this.getErrorMessage(error, error.name, {})
  }
}
export default mongoose.model('Customer', customerModel)