import AWS from "aws-sdk";
import { getENV } from "../Encryption/getENV";

AWS.config.update({
  accessKeyId: getENV("REACT_APP_AWS_ACCESS_KEY_ID"),
  secretAccessKey: getENV("REACT_APP_AWS_SECRET_ACCESS_KEY"),
});

export const createFolder = async (bucketName, folderName) => {
  const s3 = new AWS.S3();
  const params = {
    Bucket: bucketName,
    Key: `${folderName}/`,
  };

  try {
    await s3.headObject(params).promise();
  } catch (error) {
    if (error.code === "NotFound") {
      await s3.putObject(params).promise();
    }
  }
};
