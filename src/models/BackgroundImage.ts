import mongoose, { Schema, Document } from 'mongoose';

interface IBackgroundImage extends Document {
    image_url: string;
}

const backgroundImageSchema = new Schema<IBackgroundImage>({
    image_url: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const BackgroundImage = mongoose.model<IBackgroundImage>('background_images', backgroundImageSchema);
