import AWS from "aws-sdk";
import { getENV } from "../Encryption/getENV";

AWS.config.update({
  accessKeyId: getENV("REACT_APP_AWS_ACCESS_KEY_ID"),
  secretAccessKey: getENV("REACT_APP_AWS_SECRET_ACCESS_KEY"),
});

export const fetchErrorFile = async (path) => {
  const s3 = new AWS.S3();
  const filePath = `${getENV("REACT_APP_AWS_S3_STAGING_PATH")}/${path}/${getENV(
    "REACT_APP_SCANNED_STATUS_FILE"
  )}`;

  const pollingInterval = 3000;
  const maxPollingTime = 15000;
  let elapsedTime = 0;

  const pollForErrorFile = async () => {
    try {
      const response = await s3
        .getObject({
          Bucket: getENV("REACT_APP_AWS_S3_BUCKET"),
          Key: filePath,
        })
        .promise();

      const fileData = response.Body.toString("utf-8");
      return JSON.parse(fileData);
    } catch (error) {
      return null;
    }
  };

  return new Promise((resolve) => {
    const pollingTimeout = setTimeout(() => {
      clearInterval(pollingIntervalId);
      resolve(null);
    }, maxPollingTime);

    const pollingIntervalId = setInterval(async () => {
      elapsedTime += pollingInterval;

      const fileData = await pollForErrorFile();

      if (fileData !== null) {
        clearInterval(pollingIntervalId);
        clearTimeout(pollingTimeout);
        resolve(fileData);
      }

      if (elapsedTime >= maxPollingTime) {
        clearInterval(pollingIntervalId);
        resolve(null);
      }
    }, pollingInterval);
  });
};
