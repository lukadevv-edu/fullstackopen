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

export default { getAll };
