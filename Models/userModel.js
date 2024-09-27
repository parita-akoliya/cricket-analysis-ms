import mongoose from 'mongoose';
import APIError from '../Utils/APIError';
import SuccessRes from '../Utils/SuccessRes';
const config = require('../Utils/config');
const httpStatus = require('http-status');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userModel = new Schema({
    password: {
        type: String,
        // match: /(?=^.{8,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*/,
        required: true,
        minlength: 4,
        maxlength: 128,
    },
    name: {
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
    timestamp: {
        type: String,
        required: false,
        unique: false,
    },
    userName: {
        type: String,
        required: false,
        unique: true,
        trim: true,
        lowercase: true,
    },
});
userModel.pre('save', async function save(next) {
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

userModel.statics = {
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
export default mongoose.model('User', userModel)