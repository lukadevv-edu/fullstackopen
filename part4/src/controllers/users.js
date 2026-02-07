const bcrypt = require("bcrypt");
const router = require("express").Router();
const { User } = require("../models/User");

router.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs");

  response.json(users);
});

router.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || !name || !password) {
    return response.status(400).send({ error: "Please put valid information" });
  }

  if (name.length < 3 || password.length < 3) {
    return response
      .status(400)
      .send({ error: "Name and password must be at least 3 characters" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = router;
