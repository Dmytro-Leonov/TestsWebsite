import useAxios from "../hooks/useAxios";

const useQuestionsApi = () => {
  const axios = useAxios("questions/");

  const testsApi = {
    createQuestionPool: async (data) => {
      const url = "question-pool/create/";
      const response = await axios.post(url, data);
      return response.data;
    },
    getQuestionPools: async () => {
      const url = "question-pool/list/";
      const response = await axios.get(url);
      return response.data;
    },
    getQuestionPool: async (id) => {
      const url = `question-pool/${id}/`;
      const response = await axios.get(url);
      return response.data;
    },
    updateQuestionPool: async (id, data) => {
      const url = `question-pool/${id}/update/`;
      const response = await axios.post(url, data);
      return response.data;
    },
    deleteQuestionPool: async (id) => {
      const url = `question-pool/${id}/delete/`;
      const response = await axios.delete(url);
      return response.data;
    },
    deleteQuestion: async (id) => {
      const url = `question/${id}/delete/`;
      const response = await axios.delete(url);
      return response.data;
    },
    updateQuestionOrder: async (id, order) => {
      const url = `question/${id}/update-order/`;
      const response = await axios.post(url, { order });
      return response.data;
    },
    createQuestion: async (data) => {
      const url = "question/create/";
      const response = await axios.post(url, data);
      return response.data;
    },
    getQuestion: async (id) => {
      const url = `question/${id}/`;
      const response = await axios.get(url);
      return response.data;
    },
    updateQuestion: async (id, data) => {
      const url = `question/${id}/update/`;
      const response = await axios.post(url, data);
      return response.data;
    }
  };

  return testsApi;
};

export default useQuestionsApi;