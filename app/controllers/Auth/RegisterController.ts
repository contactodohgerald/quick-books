import { Request, Response } from "express";
import Validator from 'validatorjs';
import { hashSync } from 'bcryptjs';
import Users from "../../models/UsersModel";
import Subscription from '../../models/Subscription/SubscriptionModel';
import Plan from "../../models/Plans/PlansModel";

import { returnMessage } from "../../../traits/SystemMessage";
import { ReturnRequest } from "../../../traits/Request";
import VerificationController from "./VerificationController";
import { sendText } from '../../../config/text';
import Mailer from "../../services/MailService";

import { generateUsername } from "../../../library/GenerateUsername";

class RegisterController {

    async registerRequest(req: Request, res: Response) {
        const body : Record<string, any> = req.body
        let validation = new Validator(body, {
            planID: 'required',
            name: 'required',
            email: 'required|email',
            phone: 'required',
            password: 'required|confirmed'
        });
        if (validation.fails())
            ReturnRequest(res, 400, validation.errors, {})
    
        const { planID, name, email, phone, password } = body;
        const hashPassword = hashSync(password, 12)
        // add country code to phone    
        //const newPhone = addCountryCode(phone, countryCode); 
        const newUsername = generateUsername(email); 
        const user: any = new Users({name, email, username: newUsername, phone, password: hashPassword });
        try {
            const plan = await Plan.findOne({ uniqueId: planID });
            if(!plan){
                ReturnRequest(res, 400, "Plan does not exit", {});
            }else{
                await user.save();
                //add subscription plan to user's table
                const subscription = new Subscription({userId: user.uniqueId, planId: plan._id, amount: plan.price})
                await subscription.save();
                //generate verification code
                const verificationCode = await VerificationController.createVerificationCode(user.uniqueId);
                if(user.notification === 'text') {
                    //send verification code to user by text
                    sendText(phone, "Your verification code is " + verificationCode + ". Please enter this code to verify your account.");
                }else{
                    //send verification code to user by email
                    const mailer = Mailer;
                    mailer.subject("Account Verification")
                        .text("Your verification code is ")
                        .code(verificationCode)
                        .text("Please enter this code to verify your account.")
                        .send(user.email);
                }
                ReturnRequest(res, 200, returnMessage("registered"), user)
            }
        } catch (err: any) {
            ReturnRequest(res, 500, err.message, {})
        }
    }

}

export default new RegisterController;