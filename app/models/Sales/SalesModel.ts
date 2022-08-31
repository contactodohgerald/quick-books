import mongoose, { Document, Schema } from 'mongoose'

export interface ISales {
    uniqueId: string;
    agentID: string;
    productID: string;
    qty: number;
    desc: string;
    availabilty: boolean;
    deletedAt: Date;
}

export interface ISaleModel extends Document, ISales { }

const SaleSchema = new Schema (
    {
        uniqueId: { type: String, required: true, unique: true },
        userID: { type: String, required: true, ref: 'Users' },
        title: { type: String, required: true },
        unit_price: { type: Number, required: true },
        qty: { type: Number, required: true },
        thumbnail: { type: String },
        desc: { type: String },
        availabilty: { type: Boolean, default: true },
        deletedAt: Date
      
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ISaleModel>('Sales', SaleSchema);

