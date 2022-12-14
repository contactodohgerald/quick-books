import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct {
    userID: string;
    title: string;
    unit_price: number;
    qty: number;
    thumbnail: string;
    desc: string;
    availabilty: boolean;
    deletedAt: Date;
}

export interface IProductModel extends Document, IProduct { }

const ProductSchema = new Schema (
    {
        userID: { type: String, required: true, ref: 'User' },
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

export default mongoose.model<IProductModel>('Product', ProductSchema);

