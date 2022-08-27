import mongoose, { Schema, Document } from "mongoose";

export interface IPlan {
    uniqueId: string;
    title: string;
    price: number;
    thumbnail: string;
    totalAgents: number;
    totalProducts: number;
    duration: number;
    deletedAt: Date;
}

export interface IPlanModel extends IPlan, Document { }

const PlanSchema = new Schema(
    {
        uniqueId: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        thumbnail: { type: String, default: 'https://funny-photo.s3.amazonaws.com/preview/navi_avatar/smiling-girl-blue-face-effect.jpg' },
        totalAgents: { type: Number, required: true },
        totalProducts: { type: Number, required: true },
        duration: { type: Number, default: 30 },
        deletedAt: Date
    },{
        timestamps: true 
    }
);

export default mongoose.model<IPlanModel>('Plan', PlanSchema);