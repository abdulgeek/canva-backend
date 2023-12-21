import mongoose, { Schema, Document } from 'mongoose';

interface ITemplate extends Document {
    components: Array<any> | any;
    image_url: string;
}

const templateSchema = new Schema<ITemplate>({
    components: {
        type: Array,
        default: [],
    },
    image_url: {
        type: String,
        default: '',
    },
}, { timestamps: true });

export const Template = mongoose.model<ITemplate>('templates', templateSchema);
