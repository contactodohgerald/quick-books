import { Request, Response } from 'express'
import { Logging } from "../../../library/Logging";
import Verification from "../../models/Verifications/VerificationModel";
import User from "../../models/UsersModel";
import { createUniqueId, createConfimationCode } from "../../../Traits/Generics";
import { ReturnRequest } from '../../../Traits/Request';
import { returnMessage } from '../../../Traits/SystemMessage';
import { sendText } from '../../../config/text';

class VerificationController {
    createVerificationCode = async (userId: string, type: string = 'account-activation' ): Promise<any> => {
        const verificationCode = createConfimationCode();
        const getVerification = await Verification.findOne({userId, status: 'pending', type});
        if(getVerification){
            getVerification.status = 'failed';
            await getVerification.save();
        }
        const verification = new Verification(
            { uniqueId: createUniqueId(), userId, code: verificationCode, type, status: 'pending'}
        );
        try {
            await verification.save();
            return verification.code;
        } catch (err) {
            Logging.error(err);
            return verificationCode;
        }
    }
    
    VerifyCode = async (req: Request, res: Response) => {
        try {
            const body : Record<string, any> = req.body;
            const { code } = body;
            const verification = await Verification.findOne({ code, status:'pending' });
            if(verification){
                verification.status = 'used';
                await verification.save();
                //activate user
                const user = await User.findOne({ uniqueId:verification.userId });
                if(user){
                    user.verified = true;
                    await user.save();
                    //send message to user
                    const message = "Your account has been activated. Please subscribe to one of our service to continue.";
                    if(user.notification === 'text') {
                        //send verification code to user by text
                        sendText(user.phone, message);
                    }else{
                        //send verification code to user by email
                    }
                }
                ReturnRequest(res, 200, returnMessage("account_verified"), {
                    user,
                    verification
                })
            }else{
                ReturnRequest(res, 400, "Invalid Code Supplied", {})
            }
        } catch (err: any) {
            Logging.error(err.message);
            ReturnRequest(res, 500, err.message, {})
        }
    }
}

export default new VerificationController; 