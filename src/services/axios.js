import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:1337/api",
  // baseURL: "http://192.168.10.107:1337/api",
  baseURL: "https://deploy-strapi.onrender.com/api",
});

export default api;
