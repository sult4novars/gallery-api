import { Schema, model } from 'mongoose';

type imageType = {
  url: string;
  creteAt: Date;
};

const imageSchema = new Schema<imageType>({
  url: {
    type: String,
    required: true,
  },
  creteAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

export default model('image', imageSchema);
