const httpStatus = require('http-status');
import express from 'express';
import Bill from '../Models/billModel';
import Customer from '../Models/customerModel';
import Owner from '../Models/ownerModel';
import BillField from '../Models/billFieldModel';
import { resolve } from 'url';
const countRouter = express.Router();
const VerifyToken = require('../validations/token.verify');
countRouter.route('/bill')
    .get(VerifyToken, async (req, res) => {
        const bills = await Bill.find({}).exec();
        let resp = await Bill.sendSuccessResponse(bills.length, 'Bill Count Given', httpStatus.CREATED)
        res.status(resp.status).send(resp)
    });
countRouter.route('/totalAmount')
    .get(VerifyToken, async (req, res) => {
        const bills = await Bill.find({}).exec();
        const totalAmount = await countAmount(bills);
        let resp = await Bill.sendSuccessResponse(totalAmount, 'Bill Successfully added', httpStatus.CREATED)
        res.status(resp.status).send(resp)
    });
countRouter.route('/customer')
    .get(VerifyToken, async (req, res) => {
        const customers = await Customer.find({}).exec();
        let resp = await Bill.sendSuccessResponse(customers.length, 'Customer Count Given', httpStatus.CREATED)
        res.status(resp.status).send(resp)
    });
async function countAmount(amountArray) {
    return new Promise((resolve, reject) => {
        let amountValue = 0;
        try {
            amountArray.forEach(amount => {
                amountValue = amountValue + Number(amount.total_amount);
            });
            resolve(amountValue);
        } catch (error) {
            reject(error);
        }
    });
}

export default countRouter;