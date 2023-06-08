import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

export const getFile = async (bucketName, filePath) => {
  const s3 = new AWS.S3();
  const params = {
    Bucket: bucketName,
    Key: filePath,
  };

  try {
    const response = await s3.getObject(params).promise();
    const data = response.Body.toString("utf-8");
    return data;
  } catch (error) {
    if (error.code === "NoSuchKey") {
      console.log(`JSON file not found`);
      return null;
    }
    console.error("Error retrieving file from S3:", error);
    throw error;
  }
};
