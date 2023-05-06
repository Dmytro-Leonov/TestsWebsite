import useAxios from "../hooks/useAxios";

const useTestsApi = () => {
  const axios = useAxios();

  const testsApi = {
    getLoginInfo: async () => {
      const url = "auth/me/";
      const res = await axios.get(url);
      return res.data;
    },
    logout: async () => {
      const url = "auth/logout/";
      const res = await axios.post(url);
      return res.data;
    },
  };

  return testsApi;
};

export default useTestsApi;
