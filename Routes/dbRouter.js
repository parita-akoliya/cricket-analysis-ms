const httpStatus = require('http-status');
import express from 'express';
import User from '../Models/userModel';
const bcrypt = require('bcryptjs');
const dbRouter = express.Router();
const config = require('../Utils/config');
const VerifyToken = require('../validations/token.verify')
var jwt = require('jsonwebtoken');
dbRouter.route('/').delete(async (req, res, next) => {
    try {
        let user = User.db.dropDatabase();
        let resp = User.sendSuccessResponse({}, 'Drop Success', httpStatus.OK)
        res.status(resp.status).send(resp)
    } catch (error) {
        throw User.checkDuplicateEmail(error);
    }
}).put(VerifyToken, async (req, res, next) => {
    try {
        let attribute = await (new User(req.body)).save();
        let resp = await User.sendSuccessResponse(req.body, 'Data Successfully Saved', httpStatus.CREATED)
        res.status(resp.status).send(resp)
    } catch (error) {
        let user = User.checkDuplicateEmail(error)
        return next(res.status(user.status).json(user))
    }
}).get(VerifyToken, async (req, res, next) => {
    User.find({}, (err, users) => {
        res.json(users)
    })
});
export default dbRouter;