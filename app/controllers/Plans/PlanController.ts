import {Request, Response} from 'express';

import  Plan  from '../../models/Plans/PlansModel';
import { ReturnRequest } from '../../../traits/Request';
import Validator from 'validatorjs';
import { createUniqueId } from '../../../traits/Generics';
import { uploadImage } from '../../../library/cloudinary';
import { returnMessage } from '../../../traits/SystemMessage';


class PlanController {
    getAllPlans = async (req: Request, res: Response) => {
        try {
            const plans = await Plan.find({ deletedAt: null });
            if(plans.length === 0){
                ReturnRequest(res, 400, returnMessage("returned_error"), {});
            }
            ReturnRequest(res, 200, returnMessage("returned_success"), plans);
        } catch (error: any) {
            ReturnRequest(res, 500, error.message, {});
        }
    }
    
    createPlan = async (req: Request, res: Response) => {
        const body : Record<string, any> = req.body
        let validation = new Validator(body, {
            title: 'required|string',
            price: 'required|numeric',
            totalAgents: 'required',
            totalProducts: 'required',
        });
        if (validation.fails())
            ReturnRequest(res, 400, validation.errors, {})
    
        const { title, price, totalAgents, totalProducts, thumbnail } = body;  
        const newThumbnail = await uploadImage(thumbnail);
        const plan = new Plan(
            { uniqueId: createUniqueId(), title, price, totalAgents, totalProducts, thumbnail: newThumbnail }
        );
        try {
            await plan.save();
            ReturnRequest(res, 200, returnMessage("created"), plan);
        } catch (error: any) {
            ReturnRequest(res, 500, error.message, {});
        }
    }
}

export default new PlanController