var AwsS3 = require("aws-sdk/clients/s3");
const s3 = new AwsS3({
  accessKeyId: "AKIAJMA4GKOO7DFW3U7Q",
  secretAccessKey: "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",
  region: "ap-south-1",
});

function listFiles(params) {
  return new Promise((resolve, reject) => {
    const s3params = {
      Bucket: "arbitodocuments",
      Delimiter: "/",
    };
    s3.listObjectsV2(s3params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function getFile(objectKey) {
  return new Promise((resolve, reject) => {
    const s3params = {
      Bucket: "arbitodocuments",
      Key: objectKey,
    };
    s3.getObject(s3params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data.Body);
    });
  });
}

module.exports = { listFiles, getFile };
