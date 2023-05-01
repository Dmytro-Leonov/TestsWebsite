// import "../index.css";
import { Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

import { Spinner } from "flowbite-react";

import Home from "./pages/Home";
import Login from "./pages/Login";

import settings from "./data/toastContainerSettings";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  changeId,
  changeFullName,
  changeEmail,
} from "./store/reducers/userSlice";

import useUserApi from "./api/userApi";

const App = () => {
  const dispatch = useDispatch();
  const userApi = useUserApi();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setUserInfo = async () => {
      const loginInfo = await userApi.getLoginInfo();

      dispatch(changeId(loginInfo.id));
      dispatch(changeFullName(loginInfo.full_name));
      dispatch(changeEmail(loginInfo.email));

      setIsLoading(false);
    };

    const token = localStorage.getItem("token");
    if (token) {
      setUserInfo();
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col justify-center">
      {isLoading ? (
        <div className="text-center">
          <Spinner aria-label="Loading spinner" size="xl" />
        </div>
      ) : (
        <>
          <ToastContainer {...settings} />
          <Header />
          <main className="mx-auto my-1 flex w-full max-w-screen-xl grow bg-white p-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
