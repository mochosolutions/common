import { S3Client, ListObjectsCommand, ListObjectsCommandOutput, PutObjectCommand, S3 } from "@aws-sdk/client-s3";

export const getS3Client = (region: string, accessKeyId: string, secretAccessKey: string): S3Client => {
  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });
}

export const listObjectNames = async (bucketName: string, s3Client: S3Client): Promise<ListObjectsCommandOutput> => {
  const command = new ListObjectsCommand({ Bucket: bucketName });
  try {
    const data = await s3Client.send(command);
    return data;
  } catch (error) {
    console.log('Error', error);
    throw error;
  }
}


export const s3Cleanup = async (keysToRemove: string[], bucketName: string, s3Client: S3Client) => {
  try {
    const s3ResponseObjectList = await listObjectNames(bucketName, s3Client);
    if (s3ResponseObjectList) {
      const filesKey = s3ResponseObjectList?.Contents?.map((file: any) => file.Key) ?? [];

      const filteredKeys = filesKey.filter(object => {
        return keysToRemove.some(keyToRemove => object.includes(keyToRemove));
      });

      return filteredKeys;
    }

  } catch (e) {
    console.error("Error in s3Cleanup", e)
    throw e;
  }
}



export async function uploadDataToS3(bucketName: string, objectKey: string, data: any, s3Client: S3Client) {
  // Convert data to JSON string
  const body = JSON.stringify(data);

  // Create a PutObjectCommand
  const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: body,
      ContentType: 'application/json'
  });

  try {
      // Upload the object to S3
      const response = await s3Client.send(putObjectCommand);
      console.log("Success", response);
      return response;
  } catch (err) {
      console.log("Error", err);
      throw err;
  }
}
