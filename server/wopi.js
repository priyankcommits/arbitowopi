var express = require("express");
var router = express.Router();
var fs = require("fs");
const { getList, getFile, putFile } = require("./azure");

router.post("/files/:fileId", async function (req, res) {
  console.log("POST");
  let list = await getList();
  let file = list.find((l) => l.name === req.params.fileId);

  if (req.query.access_token !== "123")
    return res.status(401).json({ error: "Invalid access token" });
  res.json({
    BaseFileName: file.name,
    Size: file.properties.contentLength,
    UserId: "operations@arbito.in",
    OwnerId: "operations@arbito.in",
    Version: "1",
    UserFriendlyName: "test",
    PostMessageOrigin: "https://testdomain2.arbito.in",
    PostMessageOriginAllowed: true,
    FileName: file.name,
    Name: file.name,
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
  console.log("GET");
  let list = await getList();
  let file = list.find((l) => l.name === req.params.fileId);
  console.log(list);

  if (req.query.access_token !== "123")
    return res.status(401).json({ error: "Invalid access token" });
  res.json({
    BaseFileName: file.name,
    Size: file.properties.contentLength,
    UserId: "operations@arbito.in",
    OwnerId: "operations@arbito.in",
    Version: "1",
    UserFriendlyName: "test",
    PostMessageOrigin: "https://testdomain2.arbito.in",
    PostMessageOriginAllowed: true,
    FileName: file.name,
    Name: file.name,
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
  console.log("GET CONTENT");
  if (req.query.access_token !== "123")
    return res.status(401).json({ error: "Invalid access token" });
  let list = await getList();
  let file = list.find((l) => l.name === req.params.fileId);
  let bin = await getFile(file.name);
  res.send(bin);
});

router.post("/files/:fileId/contents", async function (req, res) {
  console.log("POST CONTENT");
  let list = await getList();
  let file = list.find((l) => l.name === req.params.fileId);
  await putFile(file.name, req.body);
  res.status(200).end();
});

module.exports = router;
