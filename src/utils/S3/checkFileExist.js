import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

export const checkFileExist = async (applicationId, instanceId, fileName) => {
  const s3 = new AWS.S3();

  const params = {
    Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
    Key: `${process.env.REACT_APP_AWS_S3_STAGING_PATH}/${applicationId}/${instanceId}/${fileName}`,
  };

  try {
    await s3.headObject(params).promise();
    return true;
  } catch (error) {
    if (error.code === "NotFound") {
      return false;
    }
    console.error(`Error checking file existence: ${fileName}`, error);
  }
};
