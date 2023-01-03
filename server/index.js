const express = require("express");
var path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { getList } = require("./azure");
var wopiRouter = require("./wopi");
var maxDocumentSize = "100mb";

const app = express();

app.use(bodyParser.json());

app.use(cors());

function check(req) {
  if (req.headers["x-wopi-override"] === "PUT") {
    return true;
  } else {
    return false;
  }
}

app.use(express.json({ limit: maxDocumentSize }));
app.use(express.urlencoded({ extended: false, limit: maxDocumentSize }));
app.use(bodyParser.raw({ limit: maxDocumentSize, type: check }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/wopi", wopiRouter);

app.options("*", cors());

app.set("view engine", "ejs");

app.get("/", async function (req, res) {
  let list = await getList();
  res.render("index", { list: list });
});

const port = 8080;
app.listen(port, () => {
  console.log(`Listening at localhost:8080`);
});
