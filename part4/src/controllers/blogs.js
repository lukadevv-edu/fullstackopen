const router = require("express").Router();
const { Blog } = require("../models/Blog");

router.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");

  response.json(blogs);
});

router.post("/", async (request, response, next) => {
  const body = request.body;

  const user = request.user;

  const blog = new Blog({
    ...body,
    user: user.id,
  });

  const result = await blog.save();

  user.blogs = user.blogs.concat(result.id);

  await user.save();

  response.status(201).json(result);
});

router.delete("/:id", async (request, response) => {
  const user = request.user;

  const foundBlog = await Blog.findById(request.params["id"]);

  if (!foundBlog) {
    return response.status(404).json({ error: "Blog doesn't exist" });
  }

  if (foundBlog.user.toString() !== request.token.id.toString()) {
    return response.status(403).json({ error: "This blog is not yours!" });
  }

  const result = await Blog.deleteOne({
    _id: request.params["id"],
  });

  user.blogs = user.blogs.filter((blog) => blog.id !== request.params["id"]);

  await user.save();

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
