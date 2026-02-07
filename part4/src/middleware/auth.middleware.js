const config = require("../config/config");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }

  return null;
};

const tokenExtractor = (request, response, next) => {
  const token = getTokenFrom(request);

  if (token) {
    const decodedToken = jwt.verify(token, config.JWT_SECRET);

    request.token = decodedToken;
  }

  next();
};

module.exports = tokenExtractor;
