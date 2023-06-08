import AWS from "aws-sdk";
import { createFolder } from "./createFolder";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

export const uploadFile = async (applicationId, instanceId, file) => {
  const bucketName = process.env.REACT_APP_AWS_S3_BUCKET;
  const folderName = process.env.REACT_APP_AWS_S3_FOLDER;

  await createFolder(bucketName, folderName);
  await createFolder(bucketName, `${folderName}/${applicationId}`);
  await createFolder(
    bucketName,
    `${folderName}/${applicationId}/${instanceId}`
  );

  const key = `${folderName}/${applicationId}/${instanceId}/${file.name}`;

  const s3 = new AWS.S3();
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file,
  };

  try {
    await s3.upload(params).promise();
    console.log("File uploaded successfully.");
    return true;
  } catch (error) {
    console.error("Error uploading file:", error);
    return false;
  }
};
