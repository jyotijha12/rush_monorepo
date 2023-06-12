import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

export const deleteFile = async (applicationId, instanceId, fileName) => {
  const s3 = new AWS.S3();

  const originalParams = {
    Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
    Key: `${process.env.REACT_APP_AWS_S3_STAGING_PATH}/${applicationId}/${instanceId}/${fileName}.pdf`,
  };

  try {
    await s3.deleteObject(originalParams).promise();
    console.log(`Successfully deleted file: ${fileName}.pdf`);
  } catch (error) {
    console.error(`Error deleting file: ${fileName}.pdf`, error);
  }

  const jsonParams = {
    Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
    Key: `${process.env.REACT_APP_AWS_S3_STAGING_PATH}/${applicationId}/${instanceId}/${fileName}.json`,
  };

  try {
    await s3.deleteObject(jsonParams).promise();
    console.log(`Successfully deleted file: ${fileName}.json`);
  } catch (error) {
    console.error(`Error deleting file: ${fileName}.json`, error);
  }
};
