import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { useDispatch } from "react-redux";
import {
  changeId,
  changeFullName,
  changeEmail,
  changeIsLoading,
} from "../store/reducers/userSlice";
import useUserApi from "../api/userApi";

import { useEffect } from "react";

import "../index.css";

import { selectFullName } from "../store/reducers/userSlice";
import { useSelector } from "react-redux";

const Layout = () => {
  const dispatch = useDispatch();
  const userApi = useUserApi();

  useEffect(() => {
    const setUserInfo = async () => {
      const userInfo = await userApi.getLoginInfo();
      console.log(userInfo);

      dispatch(changeId(userInfo.id));
      dispatch(changeFullName(userInfo.full_name));
      dispatch(changeEmail(userInfo.email));
      dispatch(changeIsLoading(false));
    };

    const token = localStorage.getItem("token");
    if (token) {
      setUserInfo();
    }
  });
  
  console.log(useSelector(selectFullName))

  return (
    <div className="flex min-h-screen flex-col justify-between">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Header />
      <main className="mx-auto my-1 flex w-full max-w-screen-xl grow bg-white p-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
