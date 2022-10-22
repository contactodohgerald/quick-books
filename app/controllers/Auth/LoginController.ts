import dotevn from 'dotenv';
import {Request, Response} from 'express';
import Validator from 'validatorjs';
import { compareSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { ReturnRequest } from '../../../traits/Request';
import { returnMessage } from '../../../traits/SystemMessage';

import Users from '../../models/UsersModel';
import VerificationController from './VerificationController';
import { sendText } from '../../../config/text';
import Mailer from '../../services/MailService';

dotevn.config();

class LoginController {
    
    async loginRequest(req: Request, res: Response) {
        try {
            const body: Record<string, any> = req.body;
            let validation = new Validator(body, {
                "username": "required",
                "password": "required"
            });
            if(validation.fails())
                ReturnRequest(res, 400, validation.errors, {});

            const { username, password } = body;    
            const user = await Users.findOne({ username: username, userType: 'user'});
            if(user){
                //first check: if the provided password is same with what we have in d system
                if(!compareSync(password, user.password)){
                    ReturnRequest(res, 404, "Incorrect Password", {});
                }
                //second check: if not verified, send verification code to user
                if(!user.verified){
                    //generate verification code
                    const verificationCode = await VerificationController.createVerificationCode(user._id);
                    const message = "Your verification code is " + verificationCode + ". Please enter this code to verify your account.";
                    if(user.notification === 'text') {
                        //send verification code to user by text
                        sendText(user.phone, message);
                    }else{
                        //send verification code to user by email
                        const mailer = Mailer;
                        mailer.subject("Account Verification")
                            .text("Your verification code is ")
                            .code(verificationCode)
                            .text("Please enter this code to verify your account.")
                            .send(user.email);
                    }
                    ReturnRequest(res, 404, returnMessage("code_sent"), user);
                }
                //third check: if the user has subscribed to the system
                if(user.subscriptionStatus != 'subscribed'){
                    ReturnRequest(res, 404, returnMessage("subscribed"), user);
                }
                //fouth check: if the user is blacked or banned
                if(user.status === 'blocked' || user.status === 'banned'){
                    ReturnRequest(res, 404, returnMessage("banned"), {});
                }

                const payload = {userID: user._id, userName: user.username, userEmail: user.email}
                const secretOrPrivateKey = process.env.JWT_SECRET || '';
                const token = jwt.sign(payload, secretOrPrivateKey, { expiresIn: '1d' });

                const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                if(user.notification === 'text'){
                    //send verification code to user by text
                    const message = "There was a successful login to your "+process.env.APP_NAME+" Account, On the "+date+" If you did not login to your "+process.env.APP_NAME+" account, kindly contact (our 24/7 Live Support) or send an email to "+process.env.APP_EMAIL;
                    sendText(user.phone, message);
                }else{
                    const mailer = Mailer;
                    mailer.subject( date +" Login Notification")
                        .text("There was a successful login to your "+process.env.APP_NAME+" Account")
                        .text("On the "+date)
                        .text("If you did not login to your "+process.env.APP_NAME+" account, kindly contact (our 24/7 Live Support) or send an email to "+process.env.APP_EMAIL)
                        .send(user.email);
                }
                ReturnRequest(res, 200, returnMessage("login"), {token: "Bearer " + token, user})
            }else{
                ReturnRequest(res, 400, returnMessage("login_error"), {});
            }
        } catch (err: any) {
            ReturnRequest(res, 500, err.message, {})
        }
    }
}

export default new LoginController