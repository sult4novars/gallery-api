import express from 'express';
import mongoose from 'mongoose';
import router from './controllers';

const app = express();

async function dbConnect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/gallery');
  } catch (error) {
    console.log(error);
  }
}

function onServerStart() {
  return console.log('http://localhost:9090/');
}

dbConnect();

app
  .use(express.json())
  .use('/images', express.static('images'))
  .use('/api/v1', router)
  .use((error, req, res, next) => { //общий обработчик ошибок
    return res.status(500).json({ error: error.toString() });
  })
  .listen(9090, onServerStart);
