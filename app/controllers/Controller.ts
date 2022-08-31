import { ReturnRequest } from '../../traits/Request';
import { returnMessage } from '../../traits/SystemMessage';

import Verification from "../models/Verifications/VerificationModel";
import User from "../models/UsersModel";
import { createUniqueId, createConfimationCode } from "../../traits/Generics";

export class Controller {

    constructor () {

    }

    ReturnRequest() {
        return ReturnRequest;
    }

}
