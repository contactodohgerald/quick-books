import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import Users from '../../models/UsersModel'
import { returnMessage } from "../../../traits/SystemMessage";
import { ReturnRequest } from "../../../traits/Request";
import Validator from 'validatorjs';

class UserController {

    async fetchAllUser(req: Request, res: Response) {
        try {
            const usertype = req.params.type;
            const users = await Users.find({ deletedAt: null, userType: usertype });
            if(users.length === 0)
                ReturnRequest(res, 400, returnMessage("returned_error"), {});
            
            ReturnRequest(res, 200, returnMessage("returned_success"), users);
        } catch (error: any) {
            ReturnRequest(res, 500, error.message, {});
        }
    }

    async updateUserPassword(req: Request, res: Response){
        const body: Record<string, any> = req.body;
        const userID = req.params.userID;
        let validation = new Validator(body, {
            current_password: 'required',
            password: 'required|confirmed'
        })
        if(validation.fails())
            ReturnRequest(res, 400, validation.errors, {});

        const { current_password, password } = body;
        const hashPassword = bcrypt.hashSync(password, 12)
        const user = await Users.findOne({_id: userID});
        if(user){
            if(bcrypt.compareSync(current_password, user.password)){
                Users.findOneAndUpdate({_id: userID}, {password: hashPassword}, (err: any) => {
                    if(err)
                        ReturnRequest(res, 500, err, {});
        
                    ReturnRequest(res, 200, returnMessage("updated"), {});    
                })
            }else{
                ReturnRequest(res, 404, "Password does not match", {});
            }
        }else{
            ReturnRequest(res, 404, returnMessage("general_error"), {});
        }
    }
}

export default new UserController