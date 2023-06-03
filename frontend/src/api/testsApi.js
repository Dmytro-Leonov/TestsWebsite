import useAxios from "../hooks/useAxios";

const useTestsApi = () => {
  const axios = useAxios("tests/");

  const testsApi = {
    create: async (data) => {
      const url = "create/";
      const response = await axios.post(url, data);
      return response.data;
    },
    get: async (id) => {
      const url = `${id}/`;
      const response = await axios.get(url);
      return response.data;
    },
    listCreated: async () => {
      const url = "list-created/";
      const response = await axios.get(url);
      return response.data;
    }
  };

  return testsApi;
};

export default useTestsApi;
