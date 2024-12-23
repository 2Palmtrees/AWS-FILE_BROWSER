import multer, { MulterError } from "multer"
// import { fileURLToPath } from 'url'
// import path, { dirname } from 'path'
// import sharp from "sharp";

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

export function multerUpload(req, res, next) {
  const storage = multer.memoryStorage()
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      // cb(null, false);
      cb(new MulterError('LIMIT_INVALID_TYPE'))
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 6 * 1024 * 1024 } // 6MB file size limit
  }).single('file');

  upload(req, res, function (err) {
    if (err instanceof MulterError) {
      return res.status(422).json({
        message: err.message || 'A multer error occured...', errors: { errors: [] }
      });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log(err);
    }
    next()
  })
}