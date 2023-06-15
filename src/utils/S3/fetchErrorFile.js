import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

export const fetchErrorFile = async (path) => {
  const s3 = new AWS.S3();
  const filePath = `${process.env.REACT_APP_AWS_S3_STAGING_PATH}/${path}/status.json`;

  const pollingInterval = 3000;
  const maxPollingTime = 60000;
  let elapsedTime = 0;

  const pollForErrorFile = async () => {
    try {
      const response = await s3
        .getObject({
          Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
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
