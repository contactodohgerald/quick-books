import mongoose, { Schema, Document } from "mongoose";

export interface IPlan {
    title: string;
    price: number;
    totalAgents: number;
    totalProducts: number;
    duration: number;
    deletedAt: Date;
}

export interface IPlanModel extends IPlan, Document { }

const PlanSchema = new Schema(
    {
        title: { type: String, required: true },
        price: { type: Number, required: true },
        totalAgents: { type: Number, required: true },
        totalProducts: { type: Number, required: true },
        duration: { type: Number, required: true },
        deletedAt: Date
    },{
        timestamps: true 
    }
);

export default mongoose.model<IPlanModel>('Plan', PlanSchema);