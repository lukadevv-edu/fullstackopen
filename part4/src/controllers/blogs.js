const router = require("express").Router();
const { Blog } = require("../models/Blog");
const { User } = require("../models/User");

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

  await User.findByIdAndUpdate(user.id, {
    $push: { blogs: result._id },
  }).populate("user");

  response.status(201).json({
    ...result,
    user,
  });
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

  await User.findByIdAndUpdate(user.id, {
    $pull: { blogs: request.params.id },
  });

  response.status(result.deletedCount < 1 ? 404 : 204).end();
});

router.put("/:id", async (request, response) => {
  const blog = request.body;

  const result = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
  });

  response.json({
    id: result.id,
    title: result.title,
    author: result.author,
    url: result.url,
    likes: result.likes,
    user: request.user,
  });
});

router.post("/:id/comments", async (request, response) => {
  const comment = request.body.comment;

  const result = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      $push: { comments: comment },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  response.json(result);
});

module.exports = router;
