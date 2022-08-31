
import mongoose, { Schema, Document } from "mongoose";

export interface INotification {
    uniqueId: string;
    userId: string;
    deletedAt: Date;
}

export interface INotificationModel extends INotification, Document { }

const NotificationSchema = new Schema(
    {
        uniqueId: { type: String, required: true },
        userId: { type: String, required: true, ref: 'Users' },
        deletedAt: { type: Date, default: null }
    },{
        timestamps: true
    }
);

export default mongoose.model<INotificationModel>('Notification', NotificationSchema);