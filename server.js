import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import ownerRouter from './Routes/ownerRouter';
import authRouter from './Routes/authRouter';
import customerRouter from './Routes/customerRouter';
import lookupRouter from './Routes/lookupRouter';
import billRouter from './Routes/billRouter';
import billReceiptRouter from './Routes/billReceipt';
import countRouter from './Routes/countRouter';
import dbRouter from './Routes/dbRouter';

const path = require('path');
const app = express();
require('dotenv-safe').load({
  path: path.join(__dirname, './.env'),
  sample: path.join(__dirname, './.env.example'),
});
const cors = require('cors');
app.use(cors({
  origin: true,
  credentials: true
}));
const port = process.env.PORT || 5656;
const db = mongoose.connect(process.env.DB_ADDRESS, {
  useNewUrlParser: true
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// app.use('/api/owner', ownerRouter);
// app.use('/api/', authRouter);
// app.use('/api/lookup', lookupRouter);
// app.use('/api/customer', customerRouter);
// app.use('/api/bill', billRouter);
// app.use('/receipt', billReceiptRouter);
// app.use('/api/count', countRouter);
app.use('/api/drop', dbRouter);

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})