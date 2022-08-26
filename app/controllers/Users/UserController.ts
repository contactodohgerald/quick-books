import { Request, Response } from 'express';

import Users from '../../models/UsersModel'
import { returnMessage } from "../../../Traits/SystemMessage";
import { ReturnRequest } from "../../../Traits/Request";

class UserController {

    async fetchAllUser(req: Request, res: Response) {
        try {
            const usertype = req.params.type;
            const users = await Users.find({ deletedAt: null, userType: usertype });
            if(users.length === 0){
                ReturnRequest(res, 400, returnMessage("returned_error"), {});
            }
            ReturnRequest(res, 200, returnMessage("returned_success"), users);
        } catch (error: any) {
            ReturnRequest(res, 500, error.message, {});
        }
    }
}

export default new UserController