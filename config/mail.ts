import dotevn from 'dotenv';

import nodemailer from 'nodemailer';

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

export default Mail
