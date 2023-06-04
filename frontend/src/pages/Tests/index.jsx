import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useTestsApi from "../../api/testsApi";

import parseError from "../../utils/parseError";
import trim from "../../utils/trim";
import {
  formatDateTime,
  formatDateTimeWithTime,
} from "../../utils/formatDateTime";

import { Link } from "react-router-dom";

import { toast } from "react-toastify";

import { Spinner, Tabs, Button, Modal } from "flowbite-react";

const Groups = () => {
  const testsApi = useTestsApi();
  const navigate = useNavigate();

  const [isLoadingTests, setIsLoadingTests] = useState(true);

  const [userTests, setUserTests] = useState([]);
  const [testsToComplete, setTestsToComplete] = useState([]);

  const [showModal, setShowModal] = useState(true);
  const [test, setTest] = useState(null);
  const [testIsLoading, setTestIsLoading] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoadingTests(true);
        const userTestsRes = await testsApi.listCreated();
        const testsToCompleteRes = await testsApi.listToComplete();
        setUserTests(userTestsRes);
        setTestsToComplete(testsToCompleteRes);
        setIsLoadingTests(false);
      } catch (error) {
        navigate("/");
      }
    };

    fetchTests();
  }, []);

  const startTest = async () => {};

  return (
    <>
      <Tabs.Group
        aria-label="Tabs with underline"
        style="underline"
        className="w-full"
      >
        <Tabs.Item title="Created tests" onClick>
          <Link to={"/tests/create"}>
            <Button>Create new test</Button>
          </Link>
          {isLoadingTests ? (
            <div className="grid w-full place-items-center">
              <Spinner size="xl" />
            </div>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {userTests.map((test) => (
                <div
                  key={test.id}
                  className="rounded-md border border-gray-500 p-2 transition-colors hover:border-gray-700 hover:text-gray-700 dark:border-gray-400 dark:hover:border-white dark:hover:text-white"
                >
                  <Link to={`/tests/${test.id}`}>
                    <span>{trim(test.name)}</span>
                    <p>Craeted: {formatDateTime(test.created_at)}</p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Tabs.Item>
        <Tabs.Item title="Tests to complete">
          {isLoadingTests ? (
            <div className="grid w-full place-items-center">
              <Spinner aria-label="Loading spinner" size="xl" />
            </div>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {testsToComplete.map((test) => (
                <button
                  key={test.id}
                  onClick={() => setShowModal(true)}
                  className="relative rounded-md border border-gray-500 p-2 text-left transition-colors hover:border-gray-700 hover:text-gray-700 dark:border-gray-400 dark:hover:border-white dark:hover:text-white"
                >
                  {test.in_progress && (
                    <span className="absolute right-1 top-1 rounded bg-green-500 px-1">
                      In progress
                    </span>
                  )}

                  <p className="text-lg font-semibold">{trim(test.name)}</p>
                  {test.description && <p>{trim(test.description)}</p>}
                  <p>Time limit: {test.time_limit}</p>
                  <p>Score: {test.score}</p>
                  <p>Start date: {formatDateTimeWithTime(test.start_date)}</p>
                  <p>End date: {formatDateTimeWithTime(test.end_date)}</p>
                  <p>
                    Attempts used: {test.used_attempts}/{test.attempts}
                  </p>
                </button>
              ))}
            </div>
          )}
        </Tabs.Item>
      </Tabs.Group>
      {/* modal to start or continue attempt */}
      <Modal show={showModal} dismissible onClose={() => setShowModal(false)}>
        <Modal.Header>Test name</Modal.Header>
        <Modal.Body>
          <div>
            {testIsLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Spinner size="xl" />
              </div>
            ) : (
              <div>
                {/* <p>{test.description}</p> */}
                <Button onClick={startTest}>Start test</Button>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Groups;
