import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User'; 

interface IUserImage extends Document {
    user_id: IUser['_id'];
    image_url: string;
}

const userImageSchema = new Schema<IUserImage>({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
    image_url: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const UserImage = mongoose.model<IUserImage>('user_images', userImageSchema);
