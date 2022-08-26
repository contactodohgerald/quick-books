import dotevn from 'dotenv';
import ejs from 'ejs';
import path from 'path';
import nodemailer from 'nodemailer';

import { Logging } from '../library/Logging'

dotevn.config();

const MAIL_USER = process.env.MAIL_USER || '';
const MAIL_PASS = process.env.MAIL_PASS || '';
const MAIL_PORT = process.env.MAIL_PORT || '';
const MAIL_HOST = process.env.MAIL_HOST || '';

const Mail = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: false,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    }
});

const message = {
    from: 'sender@gmail.com',
    to: "receiver@gmail.com",
    subject: "Mail Subject",
    html: await ejs.renderFile(path.resolve('../views/emails/template.ejs'), {
        data: {
            code: "5456"
        }
    }, {
        async: true
    })
}

Mail.sendMail(message, (err: any, info: any) => {
    if(err) throw new Logging.error(err)
})

export default Mail
