import {Request, Response} from 'express';
import Validator from 'validatorjs';

import { SubscriptionModel } from '../../models/Subscription/SubscriptionModel';
import {Plan} from "../../models/Plans/PlansModel";
import Users from "../../models/UsersModel";
import { makePaymentRequest, flw } from "../../../library/Flutterwave";
import { returnMessage } from "../../../Traits/SystemMessage";
import { ReturnRequest } from "../../../Traits/Request";
import { createUniqueId } from '../../../Traits/Generics';
import { Logging } from '../../../library/Logging';


class SubscriptioController {

    async createSubscription(req: Request, res: Response) {
        const body : Record<string, any> = req.body
        let validation = new Validator(body, {
            planId: 'required',
            userId: 'required',
            paymentMethod: 'required',
            type:'required' //recuure
        });
        if (validation.fails())
            ReturnRequest(res, 400, validation.errors, {})
        
        const {planId, userId, paymentMethod } = body;
        //get the plans
        const plan = await Plan.findOne({ uniqueId: planId });
        if(!plan){       
            ReturnRequest(res, 400, "Plan does not exit", {});
        }else{
            const user = await Users.findOne({ uniqueId: userId });
            if(!user){
                ReturnRequest(res, 400, "User does not exit", {});
            }else{
                const data = {
                    uniqueId:createUniqueId(), userId, planId, amount: plan.price, paymentMethod, status: 'pending'   
                }
                const subscription = new SubscriptionModel(data);
                try {
                    await subscription.save();
                    let paymentUrl = await makePaymentRequest(
                        subscription.uniqueId, plan.price, "http://127.0.0.1:9090/api/v1/subscriptions/verify", user.email, user.phone, user.name, subscription.uniqueId, user.uniqueId
                    )
                    const url = {
                        url: paymentUrl
                    }
                    ReturnRequest(res, 200, "Proceed to Url", url);
                } catch (error: any) {
                    Logging.error(error.message);
                    ReturnRequest(res, 500, error.message, {})
                }
            }
        }
    } 

    async verifySubscription(req: Request, res: Response) {
        const body: Record<string, any> = req.body;
        let validation = new Validator(body, {
            tx_ref: 'required',
            transaction_id: 'required',
            status: 'required',
        });
        if (validation.fails())
            ReturnRequest(res, 400, validation.errors, {})

        const { status, tx_ref, transaction_id } = body;
        if (status === 'successful') {
            const subscription = await SubscriptionModel.findOne({ uniqueId: tx_ref});
            if(subscription){
                const response = await flw.Transaction.verify({id: transaction_id});
                Logging.info(response);
                if(response){
                    if(response.data.status === "successful" && response.data.amount === subscription.amount && response.data.currency === "NGN"){
                        SubscriptionModel.findOneAndUpdate({uniqueId: subscription.uniqueId}, {status: 'success'}, (err: any) => {
                            if(err){
                                ReturnRequest(res, 500, err, {});
                            }
                            Users.findOneAndUpdate({uniqueId: response.data.meta.user_id}, { subscriptionStatus: 'subscribed' }, (err: any) => {
                                if(err){
                                    ReturnRequest(res, 500, err, {});
                                }
                                ReturnRequest(res, 200, returnMessage("updated"), subscription);
                            })      
                        })
                    }
                }else{
                    ReturnRequest(res, 404, returnMessage("returned_error"), {})
                }
            }else{
                ReturnRequest(res, 404, returnMessage("returned_error"), {})
            }
        }
    }

    async fetchAllSubcriptions(req: Request, res: Response){
        try {
            const subscriptions = await SubscriptionModel.find({ deletedAt: null});
            if(subscriptions.length == 0)
                ReturnRequest(res, 404, returnMessage("returned_error"), {});

            ReturnRequest(res, 201, returnMessage("returned_success"), subscriptions)    
        } catch (error: any) {
            ReturnRequest(res, 500, error, {})
        }
    }
}
export default new SubscriptioController