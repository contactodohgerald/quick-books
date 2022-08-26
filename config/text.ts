import dotevn from 'dotenv';

dotevn.config();

const Vonage = require('@vonage/server-sdk');
import { Logging } from '../library/Logging';

const VONAGE_API_KEY = process.env.VONAGE_API_KEY || '';
const VONAGE_API_SECRET = process.env.VONAGE_API_SECRET || '';
const APP_NAME = process.env.APP_NAME || '';

const vonage = new Vonage({
  apiKey: VONAGE_API_KEY,
  apiSecret: VONAGE_API_SECRET,
})

const from = APP_NAME

export const sendText = (to: any, message: string) => {
    vonage.message.sendSms(from, to, message, (err: string, responseData: any) => {
        if (err) {
            Logging.error(err);
        } else {
            if(responseData.messages[0]['status'] === "0") {
                Logging.info("Message sent successfully.");
            } else {
                Logging.error(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
    })
}