import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

interface IDesign extends Document {
    user_id: IUser['_id'];
    components: Array<any> | any;
    image_url: string;
}

const designSchema = new Schema<IDesign>({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
    components: {
        type: Array,
        default: [],
    },
    image_url: {
        type: String,
        default: '',
    },
}, { timestamps: true });

export const Design = mongoose.model<IDesign>('designs', designSchema);
