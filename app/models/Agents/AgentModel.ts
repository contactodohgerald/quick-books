import mongoose, { Document, Schema } from 'mongoose';

export interface IAgent {
    name: string;
    email: string;
    username: string;
    phone: string;
    userID: string;
    balance: number;
    status: string;
    password: string;
    deletedAt: Date;
}

export interface IAgentModel extends IAgent, Document {}

const AgentSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type:String, required: true },
        phone: { type:String, required: false },
        userID: { type: String, required: true, ref: 'User' },
        balance: { type: Number, default: 0 },
        status: { type: String, default: 'pending' },
        password:  { type: String, required: true },
        deletedAt: { type: Date, default: null },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export default mongoose.model<IAgentModel>('Agent', AgentSchema);