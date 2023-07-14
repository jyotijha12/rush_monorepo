import AWS from "aws-sdk";
import { getENV } from "../Encryption/getENV";

AWS.config.update({
  accessKeyId: getENV("REACT_APP_AWS_ACCESS_KEY_ID"),
  secretAccessKey: getENV("REACT_APP_AWS_SECRET_ACCESS_KEY"),
  region: getENV("REACT_APP_AWS_REGION"),
});

export const listFiles = async (path) => {
  const s3 = new AWS.S3();

  const listParams = {
    Bucket: getENV("REACT_APP_AWS_S3_BUCKET"),
    Prefix: `${getENV("REACT_APP_AWS_S3_STAGING_PATH")}/${path}`,
  };

  try {
    const response = await s3.listObjectsV2(listParams).promise();
    const fileList = response.Contents.map((file) => file.Key.split("/").pop());
    return fileList.filter(Boolean);
  } catch (error) {}
};
