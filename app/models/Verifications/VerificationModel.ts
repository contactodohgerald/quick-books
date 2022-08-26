import mongoose, { Schema, Document } from "mongoose";

export interface IVerification {
    uniqueId: string;
    userId: string;
    code: string;
    type: string;
    status: string;
    deletedAt: Date;
}

export interface IVerificationModel extends IVerification, Document {}

const VerificationSchema: Schema = new Schema(
    {
        uniqueId: { type: String, required: true, unique: true },
        userId: { type: String, required: true, ref: 'User' },
        code: { type: String, required: true },
        type: { type: String, required: true },
        status: { type: String, default: 'pending' },
        deletedAt: { type: Date, default: null },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export default mongoose.model<IVerificationModel>('Verification', VerificationSchema);