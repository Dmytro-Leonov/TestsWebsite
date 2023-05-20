import useAxios from "../hooks/useAxios";

const useGroupsApi = () => {
  const axios = useAxios("groups/");

  const groupsApi = {
    create: async (name) => {
      const url = "create/";
      const data = { name: name };
      const res = await axios.post(url, data);
      return res.data;
    },
    details: async (id) => {
      const url = `details/${id}/`;
      const res = await axios.get(url);
      return res.data;
    },
    update: async (id, name) => {
      const url = `update/${id}/`;
      const data = { name: name };
      const res = await axios.patch(url, data);
      return res.data;
    },
    delete: async (id) => {
      const url = `delete/${id}/`;
      const res = await axios.delete(url);
      return res.data;
    },
    listCreatedByUser: async () => {
      const url = "list-created-by-user/";
      const res = await axios.get(url);
      return res.data;
    },
    listForUserAsAMember: async () => {
      const url = "list-for-user-as-a-member/";
      const res = await axios.get(url);
      return res.data;
    },
    addMembers: async (id, emailsList) => {
      const url = `add-members/${id}/`;
      const data = { emails: emailsList };
      const res = await axios.post(url, data);
      return res.data;
    },
    removeMember: async (id, memberId) => {
      const url = `remove-member/${id}/${memberId}/`;
      const res = await axios.delete(url);
      return res.data;
    },
    leave: async (id) => {
      const url = `leave/${id}/`;
      const res = await axios.delete(url);
      return res.data;
    }
  };

  return groupsApi;
};

export default useGroupsApi;
