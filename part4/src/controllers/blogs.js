const router = require("express").Router();
const { Blog } = require("../models/Blog");

router.get("/", async (request, response) => {
  const blogs = await Blog.find({});

  response.json(blogs);
});

router.post("/", async (request, response, next) => {
  try {
    const blog = new Blog(request.body);
    const result = await blog.save();

    response.status(201).json(result);
  } catch (e) {
    if (e.name === "ValidationError") {
      return response.status(400).end();
    }

    next(e);
  }
});

router.delete("/:id", async (request, response) => {
  const result = await Blog.deleteOne(request.params["id"]);

  response.status(result.deletedCount < 1 ? 404 : 204).end();
});

router.put("/:id", async (request, response) => {
  const blog = request.body;

  const result = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });

  response.json(result);
});

module.exports = router;
