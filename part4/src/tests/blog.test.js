const { test, after, describe, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const assert = require("node:assert");
const { Blog } = require("../models/Blog");
const { title } = require("node:process");

const api = supertest(app);

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

Object.freeze(blogs);

{
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(blogs);
  });

  after(async () => {
    await mongoose.connection.close();
  });
}

describe("Blog 'READ' tests", () => {
  test("blogs endpoint returns correct length", async () => {
    const body = (await api.get("/api/blogs")).body;

    // Equals to initial blogs value length
    assert.strictEqual(body.length, blogs.length);
  });

  test("[toJSON] '_id' key has not to be defined", async () => {
    const body = (await api.get("/api/blogs")).body;

    for (const blog of body) {
      assert.strictEqual(blog._id, undefined);
      assert(blog.id);
    }
  });
});

describe("Blog 'CREATE' tests", () => {
  test("check if it was added", async () => {
    const newBlog = {
      title: "Testing",
      author: "lukadevv",
      url: "https://lukadevv.com/",
      likes: 402,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const result = await api.get("/api/blogs");

    assert.strictEqual(result.body.length, blogs.length + 1);
    assert(result.body.some((each) => each.title.includes(newBlog.title)));
  });

  test("check if likes property is added by default", async () => {
    const newBlog = {
      title: "Another Post",
      author: "lukadevv",
      url: "https://lukadevv.com/",
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, 0);
  });

  test("wrong new blog creation", async () => {
    const newBlog = {
      title: "Malformed Data",
      author: "lukadevv",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

describe("Blog 'UPDATE' tests", () => {
  test("likes increase", async () => {
    const targetBlog = blogs[0];
    const result = await api
      .put(`/api/blogs/${targetBlog._id}`)
      .send({
        likes: targetBlog.likes + 1,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(result.body.likes, targetBlog.likes + 1);
  });

  test("title changed", async () => {
    const targetBlog = blogs[0];
    const result = await api
      .put(`/api/blogs/${targetBlog._id}`)
      .send({
        title: "modified",
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(result.body.title, "modified");
  });
});
