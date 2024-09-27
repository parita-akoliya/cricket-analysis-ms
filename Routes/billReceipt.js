const httpStatus = require('http-status');
import express from 'express';
const billReceiptRouter = express.Router();
var fs = require('fs');
var pdf = require('dynamic-html-pdf');
const numWords = require('num-words');
import Bill from '../Models/billModel';
const VerifyToken = require('../validations/token.verify')
const invoice = require('./Invoice/invoice');
billReceiptRouter.route('/').post(VerifyToken, async (req, res, next) => {
    try {
        const invoiceObj = new invoice();
        const bill = await Bill.find({
            bill_no: req.body.billNo
        }).populate('billFieldIds').populate('ownerId').populate('customerId').exec();
        bill[0]['total_word_amount']=numWords(bill[0]['total_amount']);
        if (!bill) {
            resp = Bill.sendSuccessResponse({}, 'No Bill Found', httpStatus.NOT_FOUND);
            res.status(resp.status).send(resp)
        }
        const resp = await invoiceObj.pdf(bill[0]);
        res.contentType("application/pdf");
        res.status(httpStatus.ACCEPTED).send(resp);
    } catch (error) {
        console.error(error)
    }
});
export default billReceiptRouter;