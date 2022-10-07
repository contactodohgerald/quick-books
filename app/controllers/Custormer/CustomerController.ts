import { Request, Response } from "express";
import Validator from "validatorjs";
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
        const agent = await Agent.findOne({_id: agentID});
        if(agent){
            const custormer = new Customer({agentID, name, email, phone, address, state, country })
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

    async fetchAllCustormer(req: Request, res: Response) {
        try {
            const custormer = await Customer.find({ deletedAt: null });
            if(custormer.length === 0)
                ReturnRequest(res, 404, returnMessage("returned_error"), {});
            
            ReturnRequest(res, 201, returnMessage("returned_success"), custormer);
        } catch (error: any) {
            ReturnRequest(res, 500, error.message, {});
        }
    }

}

export default new CustomerController;