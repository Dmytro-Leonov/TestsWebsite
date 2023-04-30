import axios from "axios";

const useAxios = (baseURL = "") => {
  const instance = axios.create({
    baseURL: baseURL || import.meta.env.VITE_BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) config.headers["Authorization"] = `Token ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      if (err.response.status === 401) {
        localStorage.clear();
      }
      return Promise.reject(err);
    }
  );

  return instance;
};

export default useAxios;
