import mongoose from 'mongoose';
import APIError from '../Utils/APIError';
import SuccessRes from '../Utils/SuccessRes';
const config = require('../Utils/config');
const httpStatus = require('http-status');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const lookupModel = new Schema({
  value: {
    type: String,
    required: true,
    unique: false,
  },
  type: {
    type: String,
    required: true,
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
  created_by: {
    type: String,
    required: true,
    unique: false,
  },
  updated_by: {
    type: String,
    required: true,
    unique: false,
  }
});
lookupModel.statics = {
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
export default mongoose.model('Attribute', lookupModel)