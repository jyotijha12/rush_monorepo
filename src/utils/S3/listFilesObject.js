import AWS from "aws-sdk";
import { getENV } from "../Encryption/getENV";

AWS.config.update({
  accessKeyId: getENV("REACT_APP_AWS_ACCESS_KEY_ID"),
  secretAccessKey: getENV("REACT_APP_AWS_SECRET_ACCESS_KEY"),
});

export const listFilesObject = async (path) => {
  const s3 = new AWS.S3();

  const listParams = {
    Bucket: getENV("REACT_APP_AWS_S3_BUCKET"),
    Prefix: `${getENV("REACT_APP_AWS_S3_STAGING_PATH")}/${path}`,
  };

  try {
    const response = await s3.listObjectsV2(listParams).promise();
    const fileList = response.Contents.filter((file) =>
      file.Key.endsWith(".pdf")
    );
    const files = await Promise.all(
      fileList.map(async (file) => {
        const fileContentParams = {
          Bucket: getENV("REACT_APP_AWS_S3_BUCKET"),
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
  } catch (error) {}
};
