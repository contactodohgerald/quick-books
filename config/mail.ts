import dotevn from 'dotenv';
import ejs from 'ejs';
import path from 'path';
import nodemailer from 'nodemailer';

import { Logging } from '../library/Logging'
import SMTPTransport from 'nodemailer/lib/smtp-transport';

dotevn.config()

const env = process.env;

const Mail = nodemailer.createTransport({
    host: env.MAIL_HOST || '',
    port: env.MAIL_PORT || 0,
    secure: false,
    auth: {
      user: env.MAIL_USER || '',
      pass: env.MAIL_PASS || '',
    }
} as SMTPTransport.Options);

// const sendMailNotification = async (to: string, subject: string, data: any) => {
//     Logging.warn(data)
//     const message ={
//         from: env.APP_EMAIL,
//         to,
//         subject,
//         html: await ejs.render(path.resolve('views/emails/template.ejs'), {data }, { async: true })
//     }

//     Mail.sendMail(message, (err: any, info: any) => {
//         if(err) Logging.error(err)
//         Logging.info(info)
//     })
// }

export default Mail
