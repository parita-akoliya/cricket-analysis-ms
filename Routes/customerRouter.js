const httpStatus = require('http-status');
import express from 'express';
import Customer from '../Models/customerModel';
const VerifyToken = require('../validations/token.verify');
const customerRouter = express.Router();
customerRouter.route('/')
    .get(async (req, res) => {
        Customer.find({}, (err, users) => {
            res.json(users)
        })
    })
    .put(async (req, res, next) => {
        try {
            let reqBody = req.body;
            let customers = await (new Customer(reqBody)).save();
            let resp = await Customer.sendSuccessResponse(req.body, 'Customer Successfully Registered', httpStatus.CREATED)
            res.status(resp.status).send(resp)
        } catch (error) {
            let owner = Customer.checkDuplicateEmail(error)
            return next(res.status(owner.status).json(owner))
        }
    }).post(async (req, res, next) => {
        try {
            const owner = await Customer.findOne({
                emailAddress: req.body.emailAddress
            }).exec();
            if (!owner) {
                resp = Customer.sendSuccessResponse({}, 'No User Found', httpStatus.NOT_FOUND);
                res.status(resp.status).send(resp)
            }
            let resp = await Customer.sendSuccessResponse(owner, 'User Details Found', httpStatus.OK)
            res.status(resp.status).send(resp)
        } catch (error) {
            let owner = Customer.checkDuplicateEmail(error)
            return next(res.status(owner.status).json(owner))
        }
    });
customerRouter.route('/delete')
    .post(async (req, res, next) => {
        try {
            let resp;
            let customer;
            if (req.body._id) {
                customer = await Customer.deleteOne({
                    _id: req.body._id
                }).exec();
            } else {
                customer = await Customer.deleteMany({
                    emailAddress: /[\s\S]+/
                }).exec();
            }
            if (!customer) {
                resp = Customer.sendSuccessResponse({}, 'No Customer Found', httpStatus.NOT_FOUND);
                res.status(resp.status).send(resp)
            }
            resp = await Customer.sendSuccessResponse(customer, 'Customer Deleted', httpStatus.OK)
            res.status(resp.status).send(resp)
        } catch (error) {
            let owner = Customer.checkDuplicateEmail(error)
            // return next(res.status(owner.status).json(owner))
        }
    });

export default customerRouter;