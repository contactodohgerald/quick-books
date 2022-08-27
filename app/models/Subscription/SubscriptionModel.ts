import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription {
    uniqueId: string;
    userId: string;
    planId: string;
    paymentMethod: string;
    amount: number;
    status: string;
    deletedAt: Date;
}

export interface ISubscriptionModel extends ISubscription, Document { }

const SubscriptionSchema = new Schema(
    {
        uniqueId: { type: String, required: true },
        userId: { type: String, required: true, ref: 'Users' },
        planId: { type: String, required: true, ref: 'Plans' },
        amount: { type: Number, required: true },
        paymentMethod: { type: String, required: true },
        status: { type: String, required: true },
        deletedAt: { type: Date, default: null }
    },{
        timestamps: true
    }
);

export default mongoose.model<ISubscriptionModel>('Subscription', SubscriptionSchema);