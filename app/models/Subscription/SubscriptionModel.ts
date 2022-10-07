import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription {
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
        userId: { type: String, required: true, ref: 'User' },
        planId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Plan' },
        amount: { type: Number, required: true },
        paymentMethod: { type: String },
        status: { type: String, required: true, default: 'pending' },
        deletedAt: { type: Date, default: null }
    },{
        timestamps: true
    }
);

export default mongoose.model<ISubscriptionModel>('Subscription', SubscriptionSchema);