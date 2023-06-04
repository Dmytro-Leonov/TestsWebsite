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
    update: async (id, data) => {
      const url = `${id}/update/`;
      const response = await axios.post(url, data);
      return response.data;
    },
    delete: async (id) => {
      const url = `${id}/delete/`;
      const response = await axios.delete(url);
      return response.data;
    },
    listCreated: async () => {
      const url = "list-created/";
      const response = await axios.get(url);
      return response.data;
    },
    listToComplete: async () => {
      const url = "list-to-complete/";
      const response = await axios.get(url);
      return response.data;
    }
  };

  return testsApi;
};

export default useTestsApi;
