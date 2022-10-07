import mongoose, { Document, Schema } from 'mongoose'

export interface ISales {
    agentID: string;
    custormerID: string;
    product: Object;
    desc: string;
    status: string;
    payment_method: string;
    payment_mode: string; 
    discount: Number;
    deletedAt: Date;
}

export interface ISaleModel extends Document, ISales { }

const SaleSchema = new Schema (
    {
        agentID: { type: String, required: true, ref: 'Agent' },
        custormerID: { type: String, required: true, ref: 'Customer' },
        product: [
            {
                productID : {type: String, required:true},
                qty: {type: Number, required: true}
            },
        ],
        desc: { type: String },
        status: { type: String, default: 'pending' },
        payment_method: { type: String, required: true },
        payment_mode: { type: String, required: true },
        discount: { type: Number, default: 0 },
        deletedAt: Date
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ISaleModel>('Sales', SaleSchema);

