import axios from "axios";

const API = axios.create({
  baseURL: "https://laundary.shaarapp.com/api",
});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("gjhgkj", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
