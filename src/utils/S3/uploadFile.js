import AWS from "aws-sdk";
import { createFolder } from "./createFolder";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

export const uploadFile = async (applicationId, instanceId, files) => {
  const bucketName = process.env.REACT_APP_AWS_S3_BUCKET;
  const folderName = process.env.REACT_APP_AWS_S3_STAGING_PATH;

  await createFolder(bucketName, folderName);
  await createFolder(bucketName, `${folderName}/${applicationId}`);
  await createFolder(
    bucketName,
    `${folderName}/${applicationId}/${instanceId}`
  );

  const s3 = new AWS.S3();

  try {
    for (const file of files) {
      const key = `${folderName}/${applicationId}/${instanceId}/${file.name}`;

      const params = {
        Bucket: bucketName,
        Key: key,
        Body: file,
      };

      await s3.upload(params).promise();
      console.log(`File "${file.name}" uploaded successfully.`);
    }

    return true;
  } catch (error) {
    console.error("Error uploading file:", error);
    return false;
  }
};
