const httpStatus = require('http-status');
import express from 'express';
import Attribute from '../Models/lookupDetail';
const lookupRouter = express.Router();

lookupRouter.route('/')
    .get(async (req, res) => {
        Attribute.find({}, (err, attribute) => {
            res.json(attribute)
        })
    })
    .put(async (req, res, next) => {
        try {
            let attribute = await (new Attribute(req.body)).save();
            let resp = await Attribute.sendSuccessResponse(req.body, 'Data Successfully Saved', httpStatus.CREATED)
            res.status(resp.status).send(resp)
        } catch (error) {
            let attribute = Attribute.checkDuplicateEmail(error)
            return next(res.status(attribute.status).json(attribute))
        }
    }).post(async (req, res, next) => {
        let attribute
        try {
            if (req.body.type) {
                attribute = await Attribute.find({
                    type: req.body.type
                }).exec();
            } else if (req.body.value) {
                attribute = await Attribute.find({
                    value: req.body.value
                }).exec();
            }
            if (!attribute) {
                resp = Attribute.sendSuccessResponse({}, 'No Data Found', httpStatus.NOT_FOUND);
                res.status(resp.status).send(resp)
            }
            let resp = await Attribute.sendSuccessResponse(attribute, 'Attribute Details Found', httpStatus.OK)
            res.status(resp.status).send(resp)
        } catch (error) {
            let customer = Attribute.checkDuplicateEmail(error)
            return next(res.status(attribute.status).json(attribute))
        }
    }).delete(async (req, res, next) => {
        try {
            let attribute;
            if (req.body) {
                attribute = await Attribute.deleteOne({
                    value: req.body.value,
                    type: req.body.type
                }).exec();
            } else {
                attribute = await Attribute.deleteMany({
                    value: /[\s\S]+/,
                }).exec();
            }
            let resp = await Attribute.sendSuccessResponse(attribute, 'Attribute Details Removed', httpStatus.OK)
            res.status(resp.status).send(resp)
        } catch (error) {
            let customer = Attribute.checkDuplicateEmail(error)
            return next(res.status(attribute.status).json(attribute))
        }
    })


export default lookupRouter;