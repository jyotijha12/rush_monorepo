import AWS from "aws-sdk";
import { getENV } from "../Encryption/getENV";

export const uploadStatusFile = async (applicationId, instanceId, files) => {
  AWS.config.update({
    accessKeyId: getENV("REACT_APP_AWS_ACCESS_KEY_ID"),
    secretAccessKey: getENV("REACT_APP_AWS_SECRET_ACCESS_KEY"),
    region: getENV("REACT_APP_AWS_REGION"),
  });

  const bucketName = getENV("REACT_APP_AWS_S3_BUCKET");
  const folderName = getENV("REACT_APP_AWS_S3_STAGING_PATH");

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
    }

    const statusContent = {};
    for (const file of files) {
      statusContent[file.name] = "success";
    }

    const statusFileName = "status.json";
    const statusKey = `${folderName}/${applicationId}/${instanceId}/${statusFileName}`;
    const statusParams = {
      Bucket: bucketName,
      Key: statusKey,
      Body: JSON.stringify(statusContent),
    };
    await s3.upload(statusParams).promise();

    return true;
  } catch (error) {
    return false;
  }
};
