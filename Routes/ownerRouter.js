const httpStatus = require('http-status');
import express from 'express';
import Owner from '../Models/ownerModel';
const VerifyToken = require('../validations/token.verify');
const ownerRouter = express.Router();
ownerRouter.route('/')
    .get(async (req, res) => {
        Owner.find({}, (err, users) => {
            res.json(users)
        })
    })
    .put(async (req, res, next) => {
        try {
            let reqBody = req.body;
            reqBody['timestamp'] = new Date();
            let owner = await (new Owner(reqBody)).save();
            let resp = await Owner.sendSuccessResponse(req.body, 'Owner Successfully Registered', httpStatus.CREATED)
            res.status(resp.status).send(resp)
        } catch (error) {
            let owner = Owner.checkDuplicateEmail(error)
            return next(res.status(owner.status).json(owner))
        }
    }).post(async (req, res, next) => {
        try {
            const owner = await Owner.findOne({
                emailAddress: req.body.email
            }).exec();
            if (!owner) {
                resp = Owner.sendSuccessResponse({}, 'No User Found', httpStatus.NOT_FOUND);
                res.status(resp.status).send(resp)
            }
            let resp = await Owner.sendSuccessResponse(owner, 'User Details Found', httpStatus.OK)
            res.status(resp.status).send(resp)
        } catch (error) {
            let owner = Owner.checkDuplicateEmail(error)
            return next(res.status(owner.status).json(owner))
        }
    }).delete(async (req, res, next) => {
        try {
            let owner;
            if (req.body.email) {
                owner = await Owner.deleteMany({
                    emailAddress: req.body.email
                }).exec();
            } else {
                owner = await Owner.deleteMany({
                    emailAddress: /[\s\S]+/
                }).exec();
            }
            if (!owner) {
                resp = Owner.sendSuccessResponse({}, 'No User Found', httpStatus.NOT_FOUND);
                res.status(resp.status).send(resp)
            }
            let resp = await Owner.sendSuccessResponse(owner, 'User Details Found', httpStatus.OK)
            res.status(resp.status).send(resp)
        } catch (error) {
            let owner = Owner.checkDuplicateEmail(error)
            return next(res.status(owner.status).json(owner))
        }
    });


export default ownerRouter;