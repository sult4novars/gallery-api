import { Router, Request } from 'express';
import multer from 'multer';
import Image from '../models/Image';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const upload = multer({ dest: 'images/', storage });

const image = Router();
image
  .route('/image')
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
        images: images[0].images,
        count: images[0].count[0].count,
      });
    } catch (error) {
      return next(error);
    }
  })

  .post(upload.single('image'), async function (req, res, next) {
    try {
      console.log(req.file);
      return res.send('ok');
    } catch (error) {
      return next(error);
    }
  });

export default image;

// image.jpg
// image-2022-12-02-120931290313.jpg
