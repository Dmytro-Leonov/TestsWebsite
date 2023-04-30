import { useDispatch } from "react-redux";
import { changeId, changeFullName, changeEmail, changeIsLoading } from "../store/reducers/userSlice";
import useAxios from "../hooks/useAxios";

const useUserApi = () => {
  const axios = useAxios();
  const dispatch = useDispatch();

  const userApi = {
    getLoginInfo: async () => {
      const url = "auth/me/";
      const res = await axios.get(url);
      dispatch(changeIsLoading(false))
      return res.data;
    },
    logout: async () => {
      const url = "auth/logout/";
      const res = await axios.post(url);

      dispatch(changeId(null));
      dispatch(changeFullName(null));
      dispatch(changeEmail(null));
      dispatch(changeIsLoading(false));
      localStorage.removeItem("token");

      return res.data;
    },
  };

  return userApi;
};

export default useUserApi;
