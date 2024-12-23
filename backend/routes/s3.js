import express from 'express';
import { body } from 'express-validator'

import { multerUpload } from '../middleware/multer.js'
import { deleteObject, getAllObjects, uploadObject } from '../controllers/s3.js';

const router = express.Router();

router.get('/s3', getAllObjects);

router.post('/s3', multerUpload, [
  body(
    'folderName'
  )
    .optional()
    .isLength({ min: 3 })
    .withMessage('Min 3 characters')
    .isAlphanumeric()
    .withMessage('Only letters and numbers')
    .trim(),
], uploadObject)

router.delete('/s3', deleteObject)

export default router;
