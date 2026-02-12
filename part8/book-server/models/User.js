import { Schema, model } from "mongoose";

const schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
});

export default model("User", schema);
