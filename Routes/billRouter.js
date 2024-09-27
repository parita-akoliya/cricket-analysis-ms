const httpStatus = require('http-status');
import express from 'express';
import Bill from '../Models/billModel';
import Customer from '../Models/customerModel';
import Owner from '../Models/ownerModel';
import BillField from '../Models/billFieldModel';
const billRouter = express.Router();
const VerifyToken = require('../validations/token.verify');
billRouter.route('/')
    .get(VerifyToken, async (req, res) => {
        Bill.find({}).populate('billFieldIds').populate('ownerId').populate('customerId').exec((err, bills) => {
            res.json(bills)
        });
    })
    .put(VerifyToken, async (req, res, next) => {
        let reqBody = req.body;
        try {
            let billFieldsIds = []
            let totalAmount = 0;
            for (let billObj of reqBody['billFieldsIds']) {
                // billObj['total'] = Number(billObj['loading']) + Number(billObj['unloading']) + Number(billObj['freight']);
                totalAmount = totalAmount + billObj['total'];
                billObj['pkg'] = billObj['pkgNo'] + billObj['pkgType'];
                delete billObj['pkgNo'];
                delete billObj['pkgType'];
                let billField = await (new BillField(billObj)).save();
                billFieldsIds.push(billField._id)
            }
            req.body['total_amount'] = Number(totalAmount);
            delete req.body.billFields;
            const customer = await Customer.findOne({
                gst: req.body.customerGST
            }).exec();
            const owner = await Owner.findOne({
                gst: req.body.ownerGST
            }).exec();
            req.body['billFieldIds'] = billFieldsIds;
            req.body['customerId'] = customer._id;
            req.body['ownerId'] = owner._id;
            let billObj = await (new Bill(req.body)).save();
            let resp = await Bill.sendSuccessResponse(req.body, 'Bill Successfully added', httpStatus.CREATED)
            res.status(resp.status).send(resp)
        } catch (error) {
            let product = Bill.checkDuplicateEmail(error)
            return next(res.status(product.status).json(product))
        }
    }).post(VerifyToken, async (req, res, next) => {
        let bill
        try {
            if (req.body.dates) {
                bill = await Bill.find({
                    date: {
                        $gte: req.body.dates.fromdate,
                        $lte: req.body.dates.todate
                    }
                }).populate('billFieldIds').populate('ownerId').populate('customerId').exec();
            }
            else if (req.body.billNo) {
                bill = await Bill.find({
                    bill_no: req.body.billNo
                }).populate('billFieldIds').populate('ownerId').populate('customerId').exec();
            }
            if (!bill) {
                resp = Bill.sendSuccessResponse({}, 'No Bill Found', httpStatus.NOT_FOUND);
                res.status(resp.status).send(resp)
            }
            let resp = await Bill.sendSuccessResponse(bill, 'Data Fetched', httpStatus.CREATED)
            res.status(resp.status).send(resp)
        } catch (error) {
            console.error(JSON.stringify(error))
            // let product = Bill.checkDuplicateEmail(error)
            return next(res.status(httpStatus.BAD_REQUEST).json(error))
        }
    }).delete(VerifyToken, async (req, res, next) => {
        try {
            if (req.body) {
                const attribute = await Bill.deleteOne({
                    value: req.body.billId,
                }).exec();
            } else {
                const billDelete = await BillField.deleteMany({
                    updated_by: /[\s\S]+/
                }).exec();
                const attribute = await Bill.deleteMany({
                    updated_by: /[\s\S]+/
                }).exec();
            }
            let resp = await Attribute.sendSuccessResponse(attribute, 'Attribute Details Removed', httpStatus.OK)
            res.status(resp.status).send(resp)
        } catch (error) {
            let customer = Customer.checkDuplicateEmail(error)
            return next(res.status(customer.status).json(customer))
        }
    })


export default billRouter;