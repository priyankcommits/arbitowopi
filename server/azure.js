// connect-with-sas-token.js
const { BlobServiceClient } = require("@azure/storage-blob");

const accountName = "ecourts";
const sasToken =
  "sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-01-02T19:55:08Z&st=2023-01-02T11:55:08Z&spr=https,http&sig=qNiR6eQxZZ0IFPXuNTLjU%2FO7ZC3brqK0bbDRlx5wxAk%3D";
if (!accountName) throw Error("Azure Storage accountName not found");
if (!sasToken) throw Error("Azure Storage accountKey not found");

const blobServiceUri = `https://${accountName}.blob.core.windows.net`;

// https://YOUR-RESOURCE-NAME.blob.core.windows.net?YOUR-SAS-TOKEN
const blobServiceClient = new BlobServiceClient(
  `${blobServiceUri}?${sasToken}`,
  null
);

const containerName = "arbitowopi";
async function getList() {
  // create container client
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

  // Get blob content from position 0 to the end
  // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
  const downloadBlockBlobResponse = await blobClient.download();
  const downloaded = await streamToBuffer(
    downloadBlockBlobResponse.readableStreamBody
  );

  // [Node.js only] A helper method used to read a Node.js readable stream into a Buffer
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
