const { BlobServiceClient } = require("@azure/storage-blob");
const dotenv = require("dotenv");
dotenv.config();

const accountName = process.env.ACCOUNT_NAME;
const sasToken = process.env.SAS_TOKEN;
if (!accountName) throw Error("Azure Storage accountName not found");
if (!sasToken) throw Error("Azure Storage accountKey not found");

const blobServiceUri = `https://${accountName}.blob.core.windows.net`;

const blobServiceClient = new BlobServiceClient(
  `${blobServiceUri}?${sasToken}`,
  null
);

const containerName = "arbitowopi";
async function getList() {
  const containerClient = await blobServiceClient.getContainerClient(
    containerName
  );

  let blobs = containerClient.listBlobsFlat();
  let list = [];
  for await (const blob of blobs) {
    list.push(blob);
  }
  return list;
}

async function getFile(blobName) {
  const containerClient = await blobServiceClient.getContainerClient(
    containerName
  );
  const blobClient = await containerClient.getBlobClient(blobName);

  const downloadBlockBlobResponse = await blobClient.download();
  const downloaded = await streamToBuffer(
    downloadBlockBlobResponse.readableStreamBody
  );

  async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on("error", reject);
    });
  }
  return downloaded;
}

async function putFile(blobName, data) {
  const containerClient = await blobServiceClient.getContainerClient(
    containerName
  );
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const uploadBlobResponse = await blockBlobClient.uploadData(data);
}

module.exports = { getList, getFile, putFile };
