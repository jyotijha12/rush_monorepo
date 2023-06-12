import AWS from "aws-sdk";
import { getFile } from "./getFile";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

export const checkFile = async (applicationId, instanceId, fileName) => {
  const bucketName = process.env.REACT_APP_AWS_S3_BUCKET;
  const filePath = `${process.env.REACT_APP_AWS_S3_STAGING_PATH}/${applicationId}/${instanceId}/${fileName}.json`;

  try {
    const fileData = await getFile(bucketName, filePath);
    const jsonData = JSON.parse(fileData);
    return jsonData;
  } catch (error) {
    console.error("Error checking file in S3:", error);
  }
};
