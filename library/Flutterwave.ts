import dotevn from 'dotenv';
import axios from 'axios';
const Flutterwave = require('flutterwave-node-v3');
import { Logging } from '../library/Logging';

dotevn.config();

const FLW_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY || '';
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY || '';
const FLW_URL = process.env.FLW_URL || '';
const APP_NAME = process.env.APP_NAME || '';

const VERIFY_PAYMENT = process.env.VERIFY_PAYMENT || '';

export const flw = new Flutterwave(FLW_PUBLIC_KEY, FLW_SECRET_KEY);


// Initiating the transaction
export const makePaymentRequest = async (tx_ref: string, amount: number, email: string, phone: string, user_id: string) => {
    const data = {
        tx_ref,
        amount,
        currency: "USD",
        redirect_url: VERIFY_PAYMENT,
        meta: {tx_ref, user_id},
        customer: {email, phonenumber: phone},
        customizations: {
            title: APP_NAME,
            logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png"
        }
    }
    return await axios.post(FLW_URL, data, {
        headers: {
            "Authorization": `Bearer ${FLW_SECRET_KEY}`,
            "Accept": "pplication/json, text/plain, */*",
            "Content-Type": "application/json"
        },
    }).then(res => {
        const response = res.data;
        if(response.status === 'success'){
            return response.data.link;
        }
        return response
    }).catch(err => {
        return err.message;
    });
}

export const verifyPayment = (transactionId: string, expectedAmount: string, expectedCurrency: string) => {
    flw.Transaction.verify({ id: transactionId })
    .then((res: any) => {
        if (
            res.data.status === "successful" && res.data.amount === expectedAmount  && res.data.currency === expectedCurrency) {
            // Success! Confirm the customer's payment
            Logging.info(res);
            return res;
        } else {
            // Inform the customer their payment was unsuccessful
            Logging.error(res)
            return res;
        }
    })
    .catch((err: any) => Logging.error(err))
}



