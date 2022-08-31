import Notification from '../../config/mail';

class NotificationService {
    private message = {};
    private subject = '';
    private dataHold = {};

    toObject (title: string, link: string = '', action: string = '') {
        return  {
            'title': title,
            'link': link,
            'action': action
        };
    }

    data(title: string, link: string = '', action: string = ''){
        this.dataHold = this.toObject(title, link, action);
        return this;
    }

    private parse(type: any, data: any) {
        this.message = {...this.message,
            'type': type,
            'value': data
        };
    }

    send(receiver: string){
        let data_ = {...this.toObject(this.subject), ...this.dataHold};
        Notification(receiver, this.subject, data_);
    }

    text(text: any) {
        this.parse ('text', text);
        return this;
    }

    code(text: string){
        this.parse('code', text);
        return this;
    }

    goodbye(text: any){
        this.parse('goodbye', text);
        return this;
    }

    subjectHold(subject: string){
        this.subject = subject;
        return this;
    }

    action(action: any, link: any){
        this.parse('action', {
            'action': action,
            'link': link
        });
        return this;
    }

    image(image: any){
        this.parse('image', image);
        return this;
    }

    greeting(greeting: any){
        this.parse('greeting', greeting);
        return this;
    }


}

export default new NotificationService