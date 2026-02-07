const { User } = require("../models/User");

const userExtractor = async (request, response, next) => {
  const token = request.token;

  if (!token) {
    return response.status(401).json({ error: "invalid user!" });
  }

  request.user = await User.findById(token.id);
  next();
};

module.exports = userExtractor;
