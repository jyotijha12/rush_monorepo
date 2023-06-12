import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

export const listFilesObject = async (path) => {
  const s3 = new AWS.S3();

  const listParams = {
    Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
    Prefix: path,
  };

  try {
    const response = await s3.listObjectsV2(listParams).promise();
    const fileList = response.Contents.map((file) => ({
      name: file.Key.split("/").pop(),
      size: file.Size,
    }));
    const filteredFiles = fileList.filter((file) => file.name.endsWith(".pdf"));
    return filteredFiles.filter((file) => file.name !== "");
  } catch (error) {
    console.error("Error listing files:", error);
  }
};
