import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const findOne = (name) => {
  const request = axios.get(`${baseUrl}/name/${name}`);

  return request.then((response) => response.data);
};

const getAll = () => {
  const request = axios.get(`${baseUrl}/all`);

  return request.then((response) => response.data);
};

// const getAll = () => {
//   const request = axios.get(baseUrl);
//   return request.then((response) => response.data);
// };

// const create = (newObject) => {
//   const request = axios.post(baseUrl, newObject);
//   return request.then((response) => response.data);
// };

// const update = (id, newObject) => {
//   const request = axios.put(`${baseUrl}/${id}`, newObject);
//   return request.then((response) => response.data);
// };

// const deleteOne = (id) => {
//   const request = axios.delete(`${baseUrl}/${id}`);
//   return request.then((response) => response.data);
// };

export default {
  findOne,
  getAll,
};
