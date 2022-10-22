import {Request, Response} from 'express';
import Validator from 'validatorjs';

import Subscription from '../../models/Subscription/SubscriptionModel';
import Users from "../../models/UsersModel";
import { makePaymentRequest, flw } from "../../../library/Flutterwave";
import { returnMessage } from "../../../traits/SystemMessage";
import { ReturnRequest } from "../../../traits/Request";

class SubscriptioController {

    async createSubscription(req: Request, res: Response) {
        const body : Record<string, any> = req.body
        let validation = new Validator(body, {
            userId: 'required',
            paymentMethod: 'required',
        });
        if (validation.fails())
            ReturnRequest(res, 400, validation.errors, {})
        
        const {userId, paymentMethod } = body;
        const subscription = await Subscription.findOne({ userId: userId });
        if(!subscription){       
            ReturnRequest(res, 400, "Plan does not exit", {});
        }else{
            const user = await Users.findOne({ _id: subscription.userId });
            if(!user){
                ReturnRequest(res, 400, "User does not exit", {});
            }else{
                try {
                    if(paymentMethod == 'flutterwave'){
                        let paymentUrl = await makePaymentRequest(subscription._id, subscription.amount, user.email, user.phone, user._id);
                        ReturnRequest(res, 200, "Proceed to Url", paymentUrl);
                    }
                } catch (error: any) {
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
            const subscription = await Subscription.findOne({ _id: tx_ref});
            if(!subscription){
                ReturnRequest(res, 404, returnMessage("returned_error"), {});
            }else{
                const response = await flw.Transaction.verify({id: transaction_id});
                if(!response){
                    ReturnRequest(res, 404, returnMessage("returned_error"), {})
                }else{
                    if(response.data.status === "successful" && response.data.amount === subscription.amount && response.data.currency === "USD"){
                        Subscription.findOneAndUpdate({_id: subscription._id}, {status: 'success'}, (err: any) => {
                            if(err){
                                ReturnRequest(res, 500, err, {});
                            }
                            Users.findOneAndUpdate({_id: response.data.meta.user_id}, { subscriptionStatus: 'subscribed' }, (err: any) => {
                                if(err){
                                    ReturnRequest(res, 500, err, {});
                                }
                                ReturnRequest(res, 200, returnMessage("updated"), subscription);
                            })      
                        })
                    }
                }
            }
        }
    }

    async fetchAllSubcriptions(req: Request, res: Response){
        try {
            const subscriptions = await Subscription.find({ deletedAt: null});
            if(subscriptions.length == 0)
                ReturnRequest(res, 404, returnMessage("returned_error"), {});

            ReturnRequest(res, 201, returnMessage("returned_success"), subscriptions)    
        } catch (error: any) {
            ReturnRequest(res, 500, error, {})
        }
    }

    async fetchSingleSubcription(req: Request, res: Response) {
        try {
            const userID = req.params.userID;
            const subcription = await Subscription.findOne({ userId: userID }).populate({
                path: 'planId',
                select: 'title',
            });
            if(subcription){
                ReturnRequest(res, 201, returnMessage("returned_success"), subcription);
            }else{
                ReturnRequest(res, 404, returnMessage("returned_error"), {});
            }
        } catch (error: any) {
            ReturnRequest(res, 500, error.message, {});
        }
    }
}
export default new SubscriptioController