require("express-async-errors");
const config = require("./config/config");
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
app.use(morgan("tiny"));
morgan(":method :url :status :res[content-length] - :response-time ms");
const mongoose = require("mongoose");
mongoose.connect(config.MONGODB_URI);

console.log("Environment:", process.env.NODE_ENV);

app.use(cors());
app.use(express.json());

app.use(require("./middleware/auth.middleware"));

app.use("/api/login", require("./controllers/auth"));
app.use(
  "/api/blogs",
  require("./middleware/user.middleware"),
  require("./controllers/blogs"),
);
app.use("/api/users", require("./controllers/users"));

if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", require("./controllers/testing"));
}

app.use(require("./middleware/error.middleware"));

module.exports = app;
