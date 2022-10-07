import { Request, Response } from 'express'
import Verification from "../../models/Verifications/VerificationModel";
import User from "../../models/UsersModel";
import { createUniqueId, createConfimationCode } from "../../../traits/Generics";
import { ReturnRequest } from '../../../traits/Request';
import { returnMessage } from '../../../traits/SystemMessage';
import { sendText } from '../../../config/text';

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
    
    VerifyCode = async (req: Request, res: Response) => {
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
}

export default new VerificationController; 