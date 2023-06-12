import AWS from "aws-sdk";
import { listFiles } from "./listFiles";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

export const copyFiles = async (sPath, dPath) => {
  const s3 = new AWS.S3();

  const sourcePath = `${process.env.REACT_APP_AWS_S3_STAGING_PATH}/${sPath}`;
  const destinationPath = `${process.env.REACT_APP_AWS_S3_DATASTORE_PATH}/${dPath}`;

  try {
    const fileList = await listFiles(sourcePath);
    const pdfFiles = fileList.filter((file) =>
      file.toLowerCase().endsWith(".pdf")
    );

    for (const file of pdfFiles) {
      const sourceKey = `${sourcePath}/${file}`;
      const destinationKey = `${destinationPath}/${file}`;

      const copyParams = {
        Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
        CopySource: encodeURI(
          `${process.env.REACT_APP_AWS_S3_BUCKET}/${sourceKey}`
        ),
        Key: destinationKey,
      };

      await s3.copyObject(copyParams).promise();
    }
    return true;
  } catch (error) {
    console.error("Error copying files:", error);
  }
};
