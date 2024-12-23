import { CopyObjectCommand, DeleteObjectCommand, DeleteObjectsCommand, HeadObjectCommand, ListObjectsV2Command, paginateListObjectsV2, PutObjectCommand, S3Client, S3ServiceException, waitUntilObjectExists, waitUntilObjectNotExists } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import dotenv from 'dotenv';

dotenv.config();

const bucketRegion = process.env.AWS_S3_REGION;
const identityPoolId = process.env.AWS_S3_IDENTITY_POOL_ID;
export const bucketName = process.env.AWS_S3_BUCKET_NAME;
export const s3bucketUrl = 'https://' + bucketName + '.s3.' + bucketRegion + '.amazonaws.com/'

const config = {
  region: bucketRegion,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: bucketRegion },
    identityPoolId: identityPoolId,
  })
}
const client = new S3Client(config);

/**
 * Log all of the object keys in a bucket.
 * @param {{ delimiter: string, prefix: string }}
 */
export const s3listAllObjects = async ({ delimiter, prefix }) => {
  /** @type {string[][]} */
  // const files = []
  // const subFolders = []
  try {
    const paginator = paginateListObjectsV2(
      { client },
      { Bucket: bucketName, Delimiter: delimiter, Prefix: prefix }
    )
    // for await (const page of paginator) {
    //   files.push(...(page.Contents ?? []));
    //   subFolders.push(...(page.CommonPrefixes ?? []));
    // }
    // return { files, subFolders }
    return paginator
  } catch (caught) {
    throw caught;
  }
};

/**
 * Upload a file to an S3 bucket.
 * @param {{ key: string, body: string }}
 */
export const s3uploadFile = async ({ key, body }) => {

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
  });

  try {
    const response = await client.send(command);
    // console.log(response);
    return response
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === "EntityTooLarge"
    ) {
      console.error(
        `Error from S3 while uploading object to ${bucketName}. \
The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
or the multipart upload API (5TB max).`,
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while uploading object to ${bucketName}.  ${caught.name}: ${caught.message}`,
      );
    } else {
      throw caught;
    }
  }
};

/**
 * Delete one object from an Amazon S3 bucket.
 * @param {{ key: string }}
 */
export const s3deleteObject = async ({ key }) => {
  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );
    await waitUntilObjectNotExists(
      { client },
      { Bucket: bucketName, Key: key },
    );
    // A successful delete, or a delete for a non-existent object, both return
    // a 204 response code.
    console.log(
      `The object "${key}" from bucket "${bucketName}" was deleted, or it didn't exist.`,
    );
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === "NoSuchBucket"
    ) {
      console.error(
        `Error from S3 while deleting object from ${bucketName}. The bucket doesn't exist.`,
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while deleting object from ${bucketName}.  ${caught.name}: ${caught.message}`,
      );
    } else {
      throw caught;
    }
  }
};
/**
 * Delete multiple objects from an S3 bucket.
 * @param {{  keys: string[] }}
 */
export const s3deleteObjects = async ({ keys }) => {

  try {
    const { Deleted } = await client.send(
      new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
          Objects: keys.map((k) => ({ Key: k })),
        },
      }),
    );
    for (const key in keys) {
      await waitUntilObjectNotExists(
        { client },
        { Bucket: bucketName, Key: key },
      );
    }
    console.log(
      `Successfully deleted ${Deleted.length} objects from S3 bucket. Deleted objects:`,
    );
    console.log(Deleted.map((d) => ` • ${d.Key}`).join("\n"));
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === "NoSuchBucket"
    ) {
      console.error(
        `Error from S3 while deleting objects from ${bucketName}. The bucket doesn't exist.`,
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while deleting objects from ${bucketName}.  ${caught.name}: ${caught.message}`,
      );
    } else {
      throw caught;
    }
  }
};

/**
 * Check if key exists.
 * @param {{ key: string }}
 */
export const s3keyExists = async ({ key }) => {
  try {
    const response = await client.send(new HeadObjectCommand({
      Bucket: bucketName,
      Key: key
    }));
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Copy an S3 object from one bucket to another.
 *
 * @param {{
*   sourceKey: string,
*   destinationKey: string }} config
*/
export const s3copyObject = async ({ sourceKey, destinationKey }) => {
  const sourceBucket = bucketName
  const destinationBucket = bucketName

  try {
    const { CopyObjectResult } = await client.send(
      new CopyObjectCommand({
        CopySource: `${sourceBucket}/${sourceKey}`,
        Bucket: destinationBucket,
        Key: destinationKey,
      }),
    );
    console.log('CopyObjectResult', CopyObjectResult);

    await waitUntilObjectExists(
      { client },
      { Bucket: destinationBucket, Key: destinationKey },
    );
    console.log(
      `Successfully copied ${sourceBucket}/${sourceKey} to ${destinationBucket}/${destinationKey}`,
    );
    return CopyObjectResult
  } catch (caught) {
    if (caught instanceof ObjectNotInActiveTierError) {
      console.error(
        `Could not copy ${sourceKey} from ${sourceBucket}. Object is not in the active tier.`,
      );
    } else {
      throw caught;
    }
  }
};