import { Schema, model } from 'mongoose';

type imageType = {
  url: string;
  creteAt: Date;
};

// схема для mongoose структура как должно хранится в монго и типы данных и дефолтные значения

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
