
import mongoose, { Schema, Document } from "mongoose";

export interface INotification {
    userId: string;
    deletedAt: Date;
}

export interface INotificationModel extends INotification, Document { }

const NotificationSchema = new Schema(
    {
        userId: { type: String, required: true, ref: 'User' },
        deletedAt: { type: Date, default: null }
    },{
        timestamps: true
    }
);

export default mongoose.model<INotificationModel>('Notification', NotificationSchema);