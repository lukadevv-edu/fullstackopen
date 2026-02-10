import axios from "axios";
const baseUrl = "/api/blogs";

const getAll = async (user) => {
  const request = await axios.get(baseUrl, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  return await request.data;
};

const createBlog = async (user, title, author, url) => {
  const request = await axios.post(
    baseUrl,
    {
      title,
      author,
      url,
    },
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    },
  );
  return await request.data;
};

const addLike = async (user, blog) => {
  const request = await axios.put(
    `${baseUrl}/${blog.id}`,
    {
      user: user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    },
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    },
  );

  return await request.data;
};

const remove = async (user, blogId) => {
  const request = await axios.delete(`${baseUrl}/${blogId}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  return await request.data;
};

const addComment = async (user, blogId, comment) => {
  const request = await axios.post(
    `${baseUrl}/${blogId}/comments`,
    {
      id: blogId,
      comment,
    },
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    },
  );

  return await request.data;
};

export default { getAll, createBlog, addLike, remove, addComment };
