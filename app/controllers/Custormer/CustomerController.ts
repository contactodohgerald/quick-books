import { Request, Response } from "express";
import Validator from "validatorjs";
import { createUniqueId } from "../../../traits/Generics";
import { ReturnRequest } from "../../../traits/Request";
import { returnMessage } from "../../../traits/SystemMessage";

import Agent from "../../models/Agents/AgentModel";
import Customer from "../../models/Customers/CustomerModel";

class CustomerController {
    async createCustormer(req: Request, res: Response) {
        const body: Record<string, any> = req.body;
        let validation = new Validator(body, {
            "agentID": "required",
            "name": "required",
            "email": "required",
            "address": "required",
            "country": "required"
        });
        if(validation.fails())
            ReturnRequest(res, 500, validation.errors, {});

        const {agentID, name, email, phone, address, state, country} = body;
        const agent = await Agent.findOne({uniqueId: agentID});
        if(agent){
            const custormer = new Customer(
                {uniqueId: createUniqueId(), agentID, name, email, phone, address, state, country }
            )
            try {
                await custormer.save();
                ReturnRequest(res, 201, returnMessage("created"), custormer);
            } catch (err: any) {
                ReturnRequest(res, 500, err.message, {});
            }
        }else{
            ReturnRequest(res, 404, returnMessage("returned_error"), {});
        }
    }


}

export default new CustomerController;