var express = require("express");
var router = express.Router();
var fs = require("fs");
const { getFile, putFile } = require("./azure");

router.post("/files/:fileId", async function (req, res) {
  let fileName = req.params.fileId;
  fileName = fileName.replace("+", " ");
  let bin = await getFile(fileName);
  let arr = req.query.access_token.split("_");
  let userId = arr[1];

  if (arr[0] !== "123")
    return res.status(401).json({ error: "Invalid access token" });
  res.json({
    BaseFileName: fileName,
    Size: bin.length,
    UserId: userId,
    OwnerId: "operations@arbito.in",
    Version: "1",
    UserFriendlyName: userId,
    PostMessageOrigin: "https://testdomain2.arbito.in",
    PostMessageOriginAllowed: true,
    FileName: fileName,
    Name: fileName,
    UserCanWrite: true,
    ReadOnly: false,
    SupportsLocks: true,
    SupportsUpdate: true,
    UserCanNotWriteRelative: true,
    LicenseCheckForEditIsEnabled: true,
    HostEditUrl: `https://testdomain2.arbito.in/wopi/files/${req.params.fileId}/contents`,
  });
});

router.get("/files/:fileId", async function (req, res) {
  let fileName = req.params.fileId;
  fileName = fileName.replace("+", " ");
  let bin = await getFile(fileName);
  let arr = req.query.access_token.split("_");
  let userId = arr[1];
  if (arr[0] !== "123")
    return res.status(401).json({ error: "Invalid access token" });
  res.json({
    BaseFileName: fileName,
    Size: bin.length,
    UserId: userId,
    OwnerId: "operations@arbito.in",
    Version: "1",
    UserFriendlyName: userId,
    PostMessageOrigin: "https://testdomain2.arbito.in",
    PostMessageOriginAllowed: true,
    FileName: fileName,
    Name: fileName,
    UserCanWrite: true,
    ReadOnly: false,
    SupportsLocks: true,
    SupportsUpdate: true,
    UserCanNotWriteRelative: true,
    LicenseCheckForEditIsEnabled: true,
    HostEditUrl: `https://testdomain2.arbito.in/wopi/files/${req.params.fileId}/contents`,
  });
});

router.get("/files/:fileId/contents", async function (req, res) {
  let arr = req.query.access_token.split("_");
  if (arr[0] !== "123")
    return res.status(401).json({ error: "Invalid access token" });
  fileName = req.params.fileId;
  fileName = fileName.replace("+", " ");
  let bin = await getFile(fileName);
  res.send(bin);
});

router.post("/files/:fileId/contents", async function (req, res) {
  let arr = req.query.access_token.split("_");
  if (arr[0] !== "123")
    return res.status(401).json({ error: "Invalid access token" });
  fileName = req.params.fileId;
  fileName = fileName.replace("+", " ");
  await putFile(fileName, req.body);
  res.status(200).end();
});

module.exports = router;
