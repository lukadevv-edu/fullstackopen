require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3003;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  PORT,
  MONGODB_URI,
  JWT_SECRET,
};
