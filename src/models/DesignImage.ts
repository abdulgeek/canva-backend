import mongoose, { Schema, Document } from 'mongoose';

interface IDesignImage extends Document {
  image_url: string;
}

const designImageSchema = new Schema<IDesignImage>({
  image_url: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const DesignImage = mongoose.model<IDesignImage>('design_images', designImageSchema);
