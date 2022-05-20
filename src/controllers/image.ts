import { Router, Request } from 'express';
import multer from 'multer';
import Image from '../models/Image';

// кофиг для мултера путь где хранить картинки и генерация названия для картинок при загрузке
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // сегодняшняя дата в таймштампе + рандомное число 1653000776876-96143602
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname); // название поля в через которое был загруже файл + uniqueSuffix + оригинальное имя файла
  },
});

const upload = multer({ dest: 'images/', storage }); // кофигурируем мултер в последствии получаем мидлвару

const image = Router(); // создаем объект роутера
image
  .route('/image') // регестрируем путь
  // региструем обработчик get для пути /image
  .get(async function (
    req: Request<{}, {}, {}, { skip: string; limit: string }>,
    res,
    next,
  ) {
    try {
      const $skip = parseInt(req.query.skip) || 0;
      const $limit = parseInt(req.query.limit) || 10;
      const images = await Image.aggregate([
        {
          $facet: {
            images: [{ $skip }, { $limit }],
            count: [{ $count: 'count' }],
          },
        },
      ]);

      console.log(images, 'images');

      return res.status(200).send({
        images: images?.[0]?.images,
        count: images?.[0]?.count?.[0]?.count,
      });
    } catch (error) {
      return next(error);
    }
  })

  // региструем обработчик post для пути /image
  .post(upload.single('image'), async function (req, res, next) {
    try {
      console.log(req.file);
      const images = new Image({ url: req.file.path }); // создание объекта имейдж с данными
      await images.save(); // сохранение его в монго дб
      return res.send('ok'); // отправка ответа что все прошло удачно
    } catch (error) {
      return next(error);
    }
  });

export default image;

// image.jpg
// image-2022-12-02-120931290313.jpg
