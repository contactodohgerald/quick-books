import dotevn from 'dotenv';

import ejs from 'ejs';
import Mail from '../../config/mail';
import path from 'path';
import { Logging } from '../../library/Logging';

dotevn.config()
const env = process.env;

export class MailService {

    private data : any[] = [];
    private title: string = ""
    
    async send<T>(receiver: any | string, mail: {from?: string, subject?: string} = {}, data : any[] | null = null) {        
        const message = {
            from: mail?.from ?? env.MAIL_HOST,
            to: receiver,
            subject: mail?.subject ?? this.title,
            html: await this.render(path.resolve('views/emails/template.ejs'), {
                data: !!data ? data : this.data
            })
        }

        Mail.sendMail(message, (err: any, info: any) => {
            if(err) Logging.error(err)
            Logging.info(info)
        })

        this.data = []
    }

    private parse <T> (type: string, value: T): any {
        return {type, value}
    }

    subject(subject: string){
        this.title = subject
        return this;
    }

    text(text: string){
        this.data.push(this.parse('text', text));
        return this;
    }
    
    image(image: string){
        this.data.push(this.parse('image', image))
        return this;
    }

    action(link: string, action: string){
        this.data.push(this.parse<any>('action', {link, action}))
        return this;
    }

    code(code: string){
        this.data.push(this.parse('action', code))
        return this;
    }

    link(link: string, action: string){
        this.data.push(this.parse<any>('link', {link, action}))
        return this;
    }

    private async render (view: string, data: ejs.Data) {
        return await ejs.renderFile(view, data, {
            async: true
        })
    }
}

const Mailer = new MailService()
export default Mailer;