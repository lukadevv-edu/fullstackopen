const { test, after, describe, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { User } = require("../models/User");

const api = supertest(app);

{
  beforeEach(async () => {
    await User.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
  });
}

describe("User test", () => {
  test("create not valid user", async () => {
    await api
      .post("/api/users")
      .send({
        username: "Good Name",
        password: "00",
      })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});
