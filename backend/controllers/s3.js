import { validationResult } from "express-validator"
import sharp from 'sharp'
import { s3bucketUrl, s3copyObject, s3deleteObject, s3deleteObjects, s3keyExists, s3listAllObjects, s3uploadFile } from "../util/aws-s3.js"

export const getAllObjects = async (req, res, next) => {
  let delimiter = req.query.delimiter
  let prefix = req.query.prefix
  let files = []
  let subFolders = []
  const objects = [];

  try {
    const paginator = await s3listAllObjects({ delimiter, prefix })

    for await (const page of paginator) {
      files.push(...(page.Contents ?? []));
      subFolders.push(...(page.CommonPrefixes ?? []));
      objects.push(page.Contents.map((o) => o.Key));
    }

    //filter folders and add construct names
    const folderObjects = subFolders.map((folder, i) => {
      let name = folder.Prefix.slice(0, -1);
      let folderName = folder.Prefix.slice(name.lastIndexOf('/') + 1, -1);
      return {
        id: i,
        folderName: folderName,
        key: folder.Prefix
      }
    })
    //filter files and add the url
    const filteredFiles = files.filter(object => !object.Key.endsWith('/'))
    const fileObjects = filteredFiles.map(object => {
      return {
        id: object.ETag,
        url: s3bucketUrl + object.Key,
        key: object.Key
      }
    })
    const data = { fileObjects, folderObjects, prefix, objects }

    // console.log(data);

    res.status(200).json({
      message: 'Fetched data successfully.',
      data
    });
  } catch (error) {
    next(error)
  }
}

export const uploadObject = async (req, res, next) => {
  const itemType = req.body.itemType

  switch (itemType) {
    case 'files':
      {
        if (!req.file) {
          return res.status(422).json({
            message: 'No Image provided...', errors: { errors: [] }
          });
        }
        // let key = req.body.prefix + req.file.originalname
        // let body = req.file.buffer

        try {
          // const exists = await s3keyExists({ key })
          // if (exists) {
          //   return res.status(422).json({
          //     message: 'This image was already uploaded...', errors: { errors: [] }
          //   });
          // }
          const uniqueSuffix = Math.round(Math.random() * 1E9)

          const { data, info } = await sharp(req.file.buffer)
            .rotate()
            .resize({ width: 1920, height: 1920, withoutEnlargement: true })
            .jpeg()
            .toBuffer({ resolveWithObject: true })
          let key = req.body.prefix + uniqueSuffix + '.jpg'
          const response = await s3uploadFile({ key, body: data.buffer })
          const newObject = {
            id: response.ETag,
            url: s3bucketUrl + key,
            key
          }
          res.status(200).json({
            message: 'File uploaded successfully!', newObject
          })


          const sizes = [
            { name: 'large', size: 1000 },
            { name: 'medium', size: 750 },
            { name: 'small', size: 500 }
          ]
          for await (const element of sizes) {
            let key = req.body.prefix + uniqueSuffix + '-' + element.name + '.jpg'
            const { data, info } = await sharp(req.file.buffer)
              .rotate()
              .resize({ width: element.size, height: element.size, withoutEnlargement: true })
              .jpeg()
              .toBuffer({ resolveWithObject: true })
            const response = await s3uploadFile({ key, body: data.buffer })
          }
        } catch (error) {
          next(error)
        }
      }
      break
    case 'folders':
      {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(422).json({
            message: 'Validation failed, entered data is incorrect.',
            errors,
          });
        }

        let folderName = req.body.folderName
        let key = req.body.prefix + req.body.folderName + '/'

        try {
          const exists = await s3keyExists({ key })
          if (exists) {
            return res.status(409).json({
              message: 'Foldername conflicts with server, please select a different one....', errors: { errors: [] }
            });
          }
          const response = await s3uploadFile({ key })
          const newObject = {
            id: response.ETag,
            folderName,
            key
          }
          res.status(200).json({
            message: 'Folder created successfully!', newObject
          })
        } catch (error) {
          next(error)
        }
      }
      break

    default:
      return res.status(500).json({
        message: 'Nothing send, stupid.',
      });
  }
}

export const deleteObject = async (req, res, next) => {
  let key = req.body.key

  if (key.endsWith('/')) {
    console.log('ITS A FOLDER');
    let keysToDelete = []
    try {
      const paginator = await s3listAllObjects({ prefix: key })
      for await (const { Contents } of paginator) {
        keysToDelete.push(...Contents.map((obj) => obj.Key));
      }
    } catch (error) {
      next(error)
    }

    try {
      await s3deleteObjects({ keys: keysToDelete })
      res.status(200).json({
        message: `Successfully deleted: ${key}`
      })
    } catch (error) {
      next(error)
    }

  } else {
    try {
      const exists = await s3keyExists({ key })
      if (exists) {
        const response = await s3deleteObject({ key })
        res.status(200).json({
          message: `Successfully deleted: ${key}`
        })
      } else {
        res.status(404).json({
          message: `${key} does not exist.`
        })
      }

    } catch (error) {
      next(error)
    }
  }
}
