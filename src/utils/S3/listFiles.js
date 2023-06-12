import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

export const listFiles = async (path) => {
  const s3 = new AWS.S3();

  const listParams = {
    Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
    Prefix: path,
  };

  try {
    const response = await s3.listObjectsV2(listParams).promise();
    const fileList = response.Contents.map((file) => file.Key.split("/").pop());
    return fileList.filter(Boolean);
  } catch (error) {
    console.error("Error listing files:", error);
  }
};
