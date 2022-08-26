import { Request, Response } from "express";
import Validator from 'validatorjs';
import Users from "../../models/UsersModel";

import { createUniqueId, addCountryCode } from "../../../Traits/Generics";
import { returnMessage } from "../../../Traits/SystemMessage";
import { ReturnRequest } from "../../../Traits/Request";
import VerificationController from "./VerificationController";
import { sendText } from '../../../config/text';


const RegisterUser = async (req: Request, res: Response) => {
    const body : Record<string, any> = req.body
    let validation = new Validator(body, {
        name: 'required',
        email: 'required|email',
        username: 'required',
        phone: 'required',
        countryCode: 'required',
        password: 'required|confirmed'
    });
    if (validation.fails())
        ReturnRequest(res, 400, validation.errors, {})

    const { name, email, username, phone, countryCode, password } = body;
    // add country code to phone    
    const newPhone = addCountryCode(phone, countryCode);   
    const user = new Users(
        {uniqueId: createUniqueId(), name, email, username, phone: newPhone, password }
    );
    try {
        await user.save();
         //generate verification code
        const verificationCode = await VerificationController.createVerificationCode(user.uniqueId);
        const message = "Your verification code is " + verificationCode + ". Please enter this code to verify your account.";
        if(user.notification === 'text') {
            //send verification code to user by text
            sendText(newPhone, message);
        }else{
            //send verification code to user by email
        }
        ReturnRequest(res, 200, returnMessage("registered"), user)
    } catch (err: any) {
        ReturnRequest(res, 500, err.message, {})
    }
}

export default RegisterUser;