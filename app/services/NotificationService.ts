import Notification from "../models/Notifications/NotificationModel";

import Mailer from "./MailService";


class NotificationService {
    
    private data : any[] = [];
    private title: string = ""
    private sender: string = ""
    
    async send(receivers: any, channels: any, data: any|null = null) {
        const notificationService = this

        await notificationService.mail(receivers)
        // const promise = channels.forEach((channel) => {
        //     channel === 'mail' && notificationService.mail(receivers)
        //     channel === 'database' && notificationService.database(data)
        // })

        this.data =[]
    }

    private parse <T> (type: string, value: T): any {
        return {type, value}
    }

    private async mail(receivers: any){
        await Mailer.send(receivers, {
            subject: this.title
        }, this.data)
    }

    private database(data: any|null){
        if(data){
            Notification.create(data)
        }
    }

    from(address: string){
        this.sender = address
        return this 
    }

    subject(subject: string){
        this.title = subject
        return this;
    }

    text(text: string){
        this.data.push(this.parse('text', text));
        return this;
    }
    
    greeting(text: string){
        this.data.push(this.parse('greeting', text));
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
    
    link(link: string, action: string){
        this.data.push(this.parse<any>('link', {link, action}))
        return this;
    }
}

export default new NotificationService()