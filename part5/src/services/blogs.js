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

export default { getAll, createBlog };
