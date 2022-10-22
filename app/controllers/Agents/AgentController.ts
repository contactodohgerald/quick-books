import dotevn from 'dotenv';
import { Request, Response } from 'express'
import Validator from 'validatorjs';
import {hashSync, compareSync} from 'bcryptjs'
import { ReturnRequest } from '../../../traits/Request';
import jwt from 'jsonwebtoken';

import Agent from '../../models/Agents/AgentModel';
import { returnMessage } from '../../../traits/SystemMessage';
import User from '../../models/UsersModel';
import { generateUsername } from "../../../library/GenerateUsername";
import Mailer from "../../services/MailService";

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
        const user = await User.findOne({_id: userID._id});
        if(user){
            const hash_pass = hashSync(password, 12);
            const newUsername = generateUsername(email); 
            const agent = new Agent({name, email, username: newUsername, password: hash_pass, userID});
            try {
                await agent.save();
                const mailer = Mailer;
                mailer.subject("Agent Account Creation")
                    .text("You were sucessfully added as an agent to Quickbook")
                    .text("Below are details details for your login credentials:")
                    .text("Name = "+ agent.name)
                    .text("Email = "+ agent.email)
                    .text("Username = "+ agent.username)
                    .text("Password = "+ password)
                    .text("Feel free update your records at any given time")
                    .send(agent.email);
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
            "username": "required",
            "password": "required",
        });
        if(validation.fails())
            ReturnRequest(res, 500, validation.errors, {});

        const { username, password } = body;    
        const agent = await Agent.findOne({ username: username});
        if(agent){
            //first check: if the provided password is same with what we have in d system
            if(!compareSync(password, agent.password))
                ReturnRequest(res, 404, "Incorrect Password", {});
            
            //fouth check: if the user is blacked or banned
            if(agent.status === 'blocked' || agent.status === 'banned')
                ReturnRequest(res, 404, returnMessage("banned"), {});
            
            const payload = {userID: agent._id, userEmail: agent.email}
            const secretOrPrivateKey = process.env.JWT_SECRET || '';
            const token = jwt.sign(payload, secretOrPrivateKey, { expiresIn: '3d' });

            ReturnRequest(res, 200, returnMessage("login"), {token: "Bearer " + token})
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