import AWS from "aws-sdk";
import { getENV } from "../Encryption/getENV";

export const uploadFile = async (applicationId, instanceId, files) => {
  AWS.config.update({
    accessKeyId: getENV("REACT_APP_AWS_ACCESS_KEY_ID"),
    secretAccessKey: getENV("REACT_APP_AWS_SECRET_ACCESS_KEY"),
    region: getENV("REACT_APP_AWS_REGION"),
  });

  const bucketName = getENV("REACT_APP_AWS_S3_BUCKET");
  const folderName = getENV("REACT_APP_AWS_S3_STAGING_PATH");

  const s3 = new AWS.S3();

  try {
    const uploadPromises = files.map((file) => {
      const key = `${folderName}/${applicationId}/${instanceId}/${file.name}`;

      const params = {
        Bucket: bucketName,
        Key: key,
        Body: file,
      };

      return s3.upload(params).promise();
    });

    await Promise.all(uploadPromises);

    return true;
  } catch (error) {
    return false;
  }
};
