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
    },
    getPreview: async (id) => {
      const url = `${id}/preview/`;
      const response = await axios.get(url);
      return response.data;
    },
    startTest: async (id) => {
      const url = `${id}/start/`;
      const response = await axios.post(url);
      return response.data;
    },
    getAttemptQuestions: async (attemptId) => {
      const url = `attempt/${attemptId}/all-questions/`;
      const response = await axios.get(url);
      return response.data;
    },
    getAttemptQuestion: async (attemptId, questionId) => {
      const url = `attempt/${attemptId}/question/${questionId}/`;
      const response = await axios.get(url);
      return response.data;
    },
    selectAnswer: async (attemptAnswerId, data) => {
      const url = `attempt/select-answer/${attemptAnswerId}/`;
      const response = await axios.post(url, data);
      return response.data;
    },
    markQuestionAsAnswered: async (attemptQuestionId, data) => {
      const url = `attempt/mark-as-answered/${attemptQuestionId}/`;
      const response = await axios.post(url, data);
      return response.data;
    },
    attemptDetails: async (attemptId) => {
      const url = `attempt/${attemptId}/details/`;
      const response = await axios.get(url);
      return response.data;
    },
    finishAttempt: async (attemptId) => {
      const url = `attempt/${attemptId}/finish/`;
      const response = await axios.post(url);
      return response.data;
    },
    stats: async (id) => {
      const url = `${id}/stats/`;
      const response = await axios.get(url);
      return response.data;
    },
    attempts: async (id) => {
      const url = `${id}/attempts/`;
      const response = await axios.get(url);
      return response.data;
    },
    attemptOverview: async (testId, attemptId) => {
      const url = `${testId}/attempts/${attemptId}/overview/`;
      const response = await axios.get(url);
      return response.data;
    }
  };

  return testsApi;
};

export default useTestsApi;
