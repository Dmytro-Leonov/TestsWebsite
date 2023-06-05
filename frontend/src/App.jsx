// import "../index.css";
import { Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

import { Spinner } from "flowbite-react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Tests from "./pages/Tests";
import Groups from "./pages/Groups";
import Group from "./pages/Group";
import Profile from "./pages/Profile";
import CreateTest from "./pages/CreateTest";
import NotFound from "./pages/NotFound";
import TestSettings from "./pages/TestSettings";
import QuestionPools from "./pages/QuestionPools";
import QuestionPool from "./pages/QuestionPool";
import CreateQuestion from "./pages/CreateQuestoin";
import EditQuestion from "./pages/EditQuestion";
import Attempt from "./pages/Attempt";

import settings from "./data/toastContainerSettings";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  changeId,
  changeFullName,
  changeEmail,
  changeSubscriptionId,
} from "./store/reducers/userSlice";

import useUserApi from "./api/userApi";

const App = () => {
  const dispatch = useDispatch();
  const userApi = useUserApi();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setUserInfo = async () => {
      setIsLoading(true);
      const loginInfo = await userApi.getLoginInfo();

      dispatch(changeId(loginInfo.id));
      dispatch(changeFullName(loginInfo.full_name));
      dispatch(changeEmail(loginInfo.email));
      dispatch(changeSubscriptionId(loginInfo.subscription_id));

      setIsLoading(false);
    };

    const token = localStorage.getItem("token");
    if (token) {
      setUserInfo();
    } else {
      setIsLoading(false);
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
          <Header />
          <main className="mx-auto my-1 flex w-full max-w-screen-xl grow bg-white p-4 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <ToastContainer {...settings} />
            <Routes>
              <Route path="*" element={<NotFound />} />
              <Route exact path="/" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/tests" element={<Tests />} />
              <Route exact path="/groups" element={<Groups />} />
              <Route exact path="/groups/:id" element={<Group />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path="/tests/create" element={<CreateTest />} />
              <Route exact path="/tests/:id" element={<TestSettings />} />
              <Route exact path="/question-pools" element={<QuestionPools />} />
              <Route exact path="/question-pools/:id" element={<QuestionPool />} />
              <Route exact path="/question-pools/:id/add-question" element={<CreateQuestion />} />
              <Route exact path="/question-pools/:id/edit-question/:questionId" element={<EditQuestion />} />
              <Route exact path="tests/:testId/attempt/:attemptId/question/:questionNumber" element={<Attempt />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
