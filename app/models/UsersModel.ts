import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    phone: string;
    username: string;
    avatar: string;
    userType: string;
    subscriptionStatus: string;
    balance: number;
    status: string;
    verified: boolean;
    notification: string;
    stripeCustormerId: string;
    password: string;
    deletedAt: Date;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type:String, required: true },
        username: { type: String, required: true, unique: true },
        avatar: { type:String, default: 'https://funny-photo.s3.amazonaws.com/preview/navi_avatar/smiling-girl-blue-face-effect.jpg' },
        userType: { type: String, default: 'user' },
        subscriptionStatus: { type: String, default: 'pending' },
        balance: { type: Number, default: 0 },
        status: { type: String, default: 'pending' },
        verified: { type: Boolean, default: false },
        notification: { type: String, default: 'text' },
        stripeCustormerId: String,
        password:  { type: String, required: true },
        deletedAt: { type: Date, default: null },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export default mongoose.model<IUserModel>('User', UserSchema);