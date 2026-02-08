const router = require("express").Router();
const { User } = require("../models/User");
const { Blog } = require("../models/Blog");

router.post("/reset", async (request, response) => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  response.status(200).end();
});

module.exports = router;
