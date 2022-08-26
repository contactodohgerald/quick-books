import {Request, Response} from 'express';
import Validator from 'validatorjs';
import { Logging } from '../../../library/Logging';
import { ReturnRequest } from '../../../Traits/Request';
import { returnMessage } from '../../../Traits/SystemMessage';

import Users from '../../models/UsersModel';

class LoginController {
    
    async loginRequest(req: Request, res: Response) {
        const body: Record<string, any> = req.body;

        let validation = new Validator(body, {
            "email": "required",
            "password": "reqiured"
        });

        if(validation.fails())
            ReturnRequest(res, 400, validation.errors, {});

        const { email, password } = body;    
        const user = await Users.findOne({ email: email, password: password});
        if(user){
            Logging.info(user)
        }else{
            ReturnRequest(res, 400, returnMessage("general_error"), {});
        }
    }
}

export default new LoginController