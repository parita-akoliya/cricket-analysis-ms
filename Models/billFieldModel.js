import mongoose from 'mongoose';
import APIError from '../Utils/APIError';
import SuccessRes from '../Utils/SuccessRes';
const config = require('../Utils/config');
const httpStatus = require('http-status');

const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const billFieldModel = new Schema({
    id: {
        type: Number
    },
    cNo: {
        type: String,
        required: false,
        unique: false,
    },
    date: {
        type: String,
        required: false,
        unique: false,
    },
    pkg: {
        type: String,
        required: false,
        unique: false,
    },
    weight: {
        type: String,
        required: false,
        unique: false,
    },
    freight: {
        type: String,
        required: false,
        unique: false,
    },
    loading: {
        type: String,
        required: false,
        unique: false,
    },
    unloading: {
        type: String,
        required: false,
        unique: false,
    },
    total: {
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
    }
});
billFieldModel.pre('save', async function save(next) {
    let self = this;
    try {
        if (!this.isModified('password')) return next();
        const rounds = 10;
        const hash = await bcrypt.hash(this.password, rounds);
        this.password = hash;
        return next();
    } catch (error) {
        return next(error);
    }
});
billFieldModel.statics = {
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
export default mongoose.model('BillField', billFieldModel)