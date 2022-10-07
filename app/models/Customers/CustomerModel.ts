import mongoose, { Document, Schema } from "mongoose";

export interface ICustormer {
    agentID: string,
    name: string,
    email: string,
    phone: string,
    address: string,
    state: string,
    country: string,
    status: string;
    deletedAt: Date;
}

export interface ICustomerModel extends Document, ICustormer { }

const CustormerSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type:String, required: false },
        agentID: { type: String, required: true, ref: 'Agent' },
        address: { type:String, required: false },
        state: { type:String, required: false },
        country: { type:String, required: false },
        status: { type: String, default: 'pending' },
        deletedAt: { type: Date, default: null },
    },
    {
        versionKey: false,
        timestamps: true,
    }
)

export default mongoose.model<ICustomerModel>('Customer', CustormerSchema);