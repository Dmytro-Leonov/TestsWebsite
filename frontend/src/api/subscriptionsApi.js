import useAxios from "../hooks/useAxios";

const useSubscriptionsApi = () => {
  const axios = useAxios("subscriptions/");

  const groupsApi = {
    details: async (id) => {
      const url = `subscription/${id}/`;
      const res = await axios.get(url);
      return res.data;
    },
  };

  return groupsApi;
};

export default useSubscriptionsApi;
