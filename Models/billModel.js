import mongoose from 'mongoose';
import APIError from '../Utils/APIError';
import SuccessRes from '../Utils/SuccessRes';
const config = require('../Utils/config');
const httpStatus = require('http-status');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const billModel = new Schema({
  lrCharge: {
    type: String,
    required: false,
    unique: false,
  },
  customerId: {
    type: Schema.ObjectId,
    ref: 'Customer'
  },
  ownerId: {
    type: Schema.ObjectId,
    ref: 'Owner'
  },
  billFieldIds: [{
    type: Schema.ObjectId,
    ref: 'BillField'
  }],
  date: {
    type: String,
    required: false,
    unique: false,
  },
  bill_no: {
    type: String,
    required: false,
    unique: false,
  },
  total_amount: {
    type: Number,
    required: false,
    unique: false,
  },
  stn_no: {
    type: String,
    required: false,
    unique: false,
  },
  fgdc_no: {
    type: String,
    required: false,
    unique: false,
  },
  comments: {
    type: String,
    required: false,
    unique: false,
  },
  consigner: {
    type: Boolean,
    required: false,
    unique: false,
  },
  consignee: {
    type: Boolean,
    required: false,
    unique: false,
  },
  transporter: {
    type: Boolean,
    required: false,
    unique: false,
  },
  station: {
    to_station: {
      type: String,
      required: false,
      unique: false,
    },
    from_station: {
      type: String,
      required: false,
      unique: false,
    }
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
});
billModel.statics = {
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
export default mongoose.model('Bill', billModel)