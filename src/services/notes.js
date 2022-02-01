import axios from "axios";
const baseUrl = "http://localhost:3001/notes";

const getAll = () => {
  return axios.get(baseUrl);
};

const create = (newObject) => {
  return axios.post(baseUrl, newObject);
};

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject);
};

//the module returns an object that has three functions (getAll, create and update) as its properties that deal with notes. The functions directly return promises returned by the axios methods

export default {
  getAll: getAll,
  create: create,
  update: update,
};
