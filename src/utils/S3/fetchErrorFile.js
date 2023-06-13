import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

export const fetchErrorFile = async (path) => {
  const s3 = new AWS.S3();
  const filePath = `${process.env.REACT_APP_AWS_S3_STAGING_PATH}/${path}/error.json`;

  let pollingInterval;
  const maxPollingTime = 15000;
  const pollingDelay = 1000;
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
      console.log("Error file content:", fileData);
      clearInterval(pollingInterval);
      return fileData();
    } catch (error) {
      console.error("Error fetching error file:", error);
    }
  };

  pollingInterval = setInterval(() => {
    elapsedTime += pollingDelay;
    if (elapsedTime >= maxPollingTime) {
      clearInterval(pollingInterval);
      console.log("Polling stopped. Error file not found.");
      return;
    }

    pollForErrorFile();
  }, pollingDelay);

  pollForErrorFile();
};
