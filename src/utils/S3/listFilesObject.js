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
    const fileList = response.Contents.filter((file) =>
      file.Key.endsWith(".pdf")
    );
    const files = await Promise.all(
      fileList.map(async (file) => {
        const fileContentParams = {
          Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
          Key: file.Key,
        };
        const fileContentResponse = await s3
          .getObject(fileContentParams)
          .promise();
        const fileContent = fileContentResponse.Body;
        const fileBlob = new Blob([fileContent], { type: "application/pdf" });

        return new File([fileBlob], file.Key.split("/").pop(), {
          type: "application/pdf",
        });
      })
    );

    return files;
  } catch (error) {
    console.error("Error listing files:", error);
  }
};
