import dotevn from 'dotenv';
import { Request, Response } from 'express'
import Validator from 'validatorjs';
import {hashSync, compareSync} from 'bcryptjs'
import { ReturnRequest } from '../../../traits/Request';
import jwt from 'jsonwebtoken';

import Agent from '../../models/Agents/AgentModel';
import { returnMessage } from '../../../traits/SystemMessage';
import User from '../../models/UsersModel';

dotevn.config();

class AgentController {
    async createAgents(req: Request, res: Response) {
        const body: Record<string, any> = req.body;
        let validation = new Validator(body, {
            "name": "required",
            "email": "required",
            "password": "required",
        });
        if(validation.fails())
            ReturnRequest(res, 500, validation.errors, {});

        const {name, email, password} = body;
        const userID = req.user;
        const user = await User.findOne({uniqueId: userID.uniqueId});
        if(user){
            const hash_pass = hashSync(password, 12);
            const agent = new Agent({name, email, password: hash_pass, userID});
            try {
                await agent.save();
                ReturnRequest(res, 200, returnMessage("created"), agent);
            } catch (err: any) {
                ReturnRequest(res, 500, err, {});
            }
        }else{
            ReturnRequest(res, 404, returnMessage("general_error"), {});
        }
    }

    async loginAgent(req: Request, res: Response) {
        const body: Record<string, any> = req.body;

        let validation = new Validator(body, {
            "email": "required",
            "password": "required",
        });
        if(validation.fails())
            ReturnRequest(res, 500, validation.errors, {});

        const { email, password } = body;    
        const agent = await Agent.findOne({ email: email});
        if(agent){
            //first check: if the provided password is same with what we have in d system
            if(!compareSync(password, agent.password))
                ReturnRequest(res, 404, "Incorrect Password", {});
            
            //fouth check: if the user is blacked or banned
            if(agent.status === 'blocked' || agent.status === 'banned')
                ReturnRequest(res, 404, returnMessage("banned"), {});
            
            const payload = {
                userID: agent._id, userEmail: agent.email
            }
            const secretOrPrivateKey = process.env.JWT_SECRET || '';
            const token = jwt.sign(payload, secretOrPrivateKey, { expiresIn: '3d' });

            ReturnRequest(res, 200, returnMessage("login"), {
                token: "Bearer " + token
            })
        }else{
            ReturnRequest(res, 500, returnMessage("general_error"), {});
        }
    }

    async fetchAllAgents(req: Request, res: Response) {
        try {
            const agents = await Agent.find({ deletedAt: null });
            if(agents.length === 0)
                ReturnRequest(res, 404, returnMessage("returned_error"), {});
            
            ReturnRequest(res, 201, returnMessage("returned_success"), agents);
        } catch (error: any) {
            ReturnRequest(res, 500, error.message, {});
        }
    }
}

export default new AgentController;