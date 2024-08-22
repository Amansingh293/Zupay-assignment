const express = require("express");
require("dotenv").config();

const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

require("./config/dbConfig");
const authRoute = require("./controllers/authentication");
const postRoute = require("./controllers/postController");

app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

app.listen(3003, () => {
  console.log("server live on 3003 port");
});
