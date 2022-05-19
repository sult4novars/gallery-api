import express from 'express';
// import mongoose from 'mongoose';
// import router from './controllers';
import type { Request, Response } from 'express';

const app = express();

// async function dbConnect() {
//   try {
//     await mongoose.connect('mongodb://localhost:27017/gallery');
//   } catch (error) {
//     console.log(error);
//   }
// }

function onServerStart() {
  return console.log('http://localhost:9090/');
}

// dbConnect();

const ping = (req: Request, res: Response) => res.status(200).send('pong');

app.use(express.json()).use('/ping', ping).listen(9090, onServerStart);
