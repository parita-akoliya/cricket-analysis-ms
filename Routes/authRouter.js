const httpStatus = require('http-status');
import express from 'express';
import User from '../Models/userModel';
const bcrypt = require('bcryptjs');
const authRouter = express.Router();
const config = require('../Utils/config');
const VerifyToken = require('../validations/token.verify')
var jwt = require('jsonwebtoken');
authRouter.route('/login').post(async (req, res, next) => {
    try {

        const user = await User.findOne({
            userName: req.body.userName
        }).exec();
        let resp
        if (!user) {
            resp = User.sendSuccessResponse({}, 'No User Found', httpStatus.INTERNAL_SERVER_ERROR);
            res.status(resp.status).send(resp)
        }
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            resp = User.sendSuccessResponse({
                auth: false,
                token: null
            }, 'Unauthorized', httpStatus.UNAUTHORIZED);
            res.status(resp.status).send(resp)
        }
        var token = jwt.sign({
            id: user._id
        }, config.secret, {
                expiresIn: 86400
            });
        resp = User.sendSuccessResponse({
            auth: true,
            token: token,
            user: user
        }, 'Login Success', httpStatus.ACCEPTED)
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
authRouter.route('/delete/user').post(VerifyToken, async (req, res, next) => {
    const users = await User.deleteOne({
        userName: req.body.userName
    }).exec();
    let resp;
    if (!users) {
        resp = User.sendSuccessResponse({}, 'No User Found', httpStatus.NOT_FOUND);
        res.status(resp.status).send(resp)
    }
    else {
        resp = User.sendSuccessResponse({}, 'User Delete Successfully', httpStatus.OK);
        res.status(resp.status).send(resp)
    }
});
authRouter.route('/me').get(VerifyToken, async (req, res, next) => {
    res.status(200).send({
        auth: true,
        message: 'Token is authenticated.'
    })
});
export default authRouter;