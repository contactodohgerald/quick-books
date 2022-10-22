import { Request, Response } from 'express'
import Verification from "../../models/Verifications/VerificationModel";
import User from "../../models/UsersModel";
import { ReturnRequest } from '../../../traits/Request';
import { returnMessage } from '../../../traits/SystemMessage';
import { sendText } from '../../../config/text';

import { createConfimationCode } from '../../../traits/Generics';

import { Controller } from '../Controller';
import Mailer from '../../services/MailService';

class VerificationController extends Controller {

    constructor () {
        super()
    }

    createVerificationCode = async (userId: string, type: string = 'account-activation' ): Promise<any> => {
        const verificationCode = createConfimationCode();
        const getVerification = await Verification.findOne({userId, status: 'pending', type});
        if(getVerification){
            getVerification.status = 'failed';
            await getVerification.save();
        }
        const verification = new Verification({userId, code: verificationCode, type, status: 'pending'});
        try {
            await verification.save();
            return verification.code;
        } catch (err) {
            return verificationCode;
        }
    }
    
    verifyCode = async (req: Request, res: Response) => {
        try {
            const body : Record<string, any> = req.body;
            const { userId, code } = body;
            const verification = await Verification.findOne({ userId, code, status:'pending' });
            if(!verification){
                ReturnRequest(res, 400, "Invalid Code Supplied", {})
            }else{
                verification.status = 'used';
                await verification.save();
                //activate user
                const user = await User.findOne({ _id: verification.userId });
                if(user){
                    user.verified = true;
                    await user.save();
                    //send message to user
                    const message = "Your account has been activated. Proceed by making payment to continue.";
                    if(user.notification === 'text') {
                        //send verification code to user by text
                        sendText(user.phone, message);
                    }else{
                        //send verification code to user by email
                        const mailer = Mailer;
                        mailer.subject("Account Activation")
                            .text(message)
                            .send(user.email);
                    }
                }
                ReturnRequest(res, 200, returnMessage("account_verified"), verification)
            }
        } catch (err: any) {
            ReturnRequest(res, 500, err.message, {})
        }
    }

    resendVerificationCode = async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId;
            const user = await User.findOne({ _id: userId})
            if(!user){
                ReturnRequest(res, 400, returnMessage("returned_error"), {});
            }else{
                const verification = await this.createVerificationCode(user._id);
                if(user.notification === 'text') {
                    //send verification code to user by text
                    sendText(user.phone, "Your verification code is " + verification + ". Please enter this code to verify your account.");
                }else{
                    //send verification code to user by email
                    const mailer = Mailer;
                    mailer.subject("Account Verification")
                        .text("Your verification code is ")
                        .code(verification)
                        .text("Please enter this code to verify your account.")
                        .send(user.email);
                }
                ReturnRequest(res, 200, returnMessage("code_sent"), user)
            }
        }catch (err: any) {
            ReturnRequest(res, 500, err, {})
        }
    }
}

export default new VerificationController; 