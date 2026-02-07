require("express-async-errors");
const config = require("./config/config");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

app.use(require("./middleware/auth.middleware"));

app.use("/login", require("./controllers/auth"));
app.use(
  "/api/blogs",
  require("./middleware/user.middleware"),
  require("./controllers/blogs"),
);
app.use("/api/users", require("./controllers/users"));

app.use(require("./middleware/error.middleware"));

module.exports = app;
