import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useTestsApi from "../../api/testsApi";
import { default as cn } from "classnames";
import { MdEdit } from "react-icons/md";
import parseError from "../../utils/parseError";
import trim from "../../utils/trim";
import {
  formatDateTime,
  formatDateTimeWithTime,
} from "../../utils/formatDateTime";

import { Link } from "react-router-dom";

import { toast } from "react-toastify";

import { Spinner, Tabs, Button, Modal } from "flowbite-react";
import Divider from "../../components/ui/Divider";

const Groups = () => {
  const testsApi = useTestsApi();
  const navigate = useNavigate();
  const [serchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(null);

  useEffect(() => {
    const tabMap = {
      created: 0,
      "to-complete": 1,
    };
    const selected = tabMap[serchParams.get("tab")] || 0;
    setTab(selected);
  }, [serchParams]);

  const [isLoadingTests, setIsLoadingTests] = useState(true);

  const [userTests, setUserTests] = useState([]);
  const [testsToComplete, setTestsToComplete] = useState([]);

  const [testIsLoading, setTestIsLoading] = useState(true);
  const [test, setTest] = useState(null);

  const [showModal, setShowModal] = useState(false);

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

  const fetchSelectedTest = async (id) => {
    try {
      setTestIsLoading(true);
      const res = await testsApi.getPreview(id);
      setTest(res);
      setTestIsLoading(false);
    } catch (error) {
      const { all_field_errors } = parseError(error);
      toast.error(all_field_errors[0]);
    }
  };

  const changeTab = (tab) => {
    const tabMap = {
      0: "created",
      1: "to-complete",
    };
    const selected = tabMap[tab];
    setSearchParams({ tab: selected });
    setTab(tab);
  };

  const startTest = async (id) => {
    try {
      const res = await testsApi.startTest(id);
      navigate(`/tests/${id}/attempt/${res.attempt_id}/question/1`);
    } catch (error) {
      const { all_field_errors } = parseError(error);
      toast.error(all_field_errors[0]);
    }
  };

  const continueTest = async (id) => {
    navigate(`/tests/${id}/attempt/${test.test.last_attempt_id}/question/1`);
  };

  return (
    <>
      {tab !== null && (
        <Tabs.Group
          aria-label="Tabs with underline"
          style="underline"
          className="w-full"
          onActiveTabChange={(tab) => changeTab(tab)}
          tabIndex={tab}
        >
          <Tabs.Item
            title="Created tests"
            active={tab === 0 || tab === null}
            tab
          >
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
                    className="relative rounded-md border border-gray-500 p-2 transition-colors dark:border-gray-400"
                  >
                    <Link to={`/tests/${test.id}`}>
                      {/* <button className="absolute right-1 top-1 cursor-pointer rounded-full border border-gray-500 p-1 transition-colors hover:border-gray-700 hover:text-gray-700 dark:border-gray-400 dark:hover:border-white dark:hover:text-white"> */}
                      <button className="absolute right-1 top-1 rounded-full border text-blue-700 hover:text-blue-800 dark:text-blue-600 dark:hover:text-blue-700 border-blue-700 hover:border-blue-800 p-1 transition-colors">
                        <MdEdit />
                      </button>
                    </Link>
                    <h3>{trim(test.name, 22)}</h3>
                    {
                      test.description && (
                        <p className="text-sm">{trim(test.description, 32)}</p>
                      )
                    }
                    <p>Created: {formatDateTime(test.created_at)}</p>
                    <div className="mt-2 flex gap-2">
                      <Link to={`/tests/${test.id}/answers-stats`}>
                        <Button size="xs">Answers stats</Button>
                      </Link>
                      <Link to={`/tests/${test.id}/test-stats`}>
                        <Button size="xs">Questions Stats</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Tabs.Item>
          <Tabs.Item title="Tests to complete" active={tab === 1}>
            {isLoadingTests ? (
              <div className="grid w-full place-items-center">
                <Spinner aria-label="Loading spinner" size="xl" />
              </div>
            ) : (
              <div className="mt-2 flex flex-wrap gap-2">
                {testsToComplete.map((test) => (
                  <button
                    key={test.id}
                    onClick={() => {
                      setShowModal(true);
                      fetchSelectedTest(test.id);
                    }}
                    className="relative rounded-md border border-gray-500 p-2 text-left transition-colors hover:border-gray-700 hover:text-gray-700 dark:border-gray-400 dark:hover:border-white dark:hover:text-white"
                  >
                    {test.in_progress && (
                      <span className="absolute right-1 top-1 rounded bg-green-500 px-1">
                        In progress
                      </span>
                    )}

                    <p className="text-lg font-semibold">{trim(test.name)}</p>
                    {test.description && <p>{trim(test.description, 40)}</p>}
                    <p>Time limit: {test.time_limit}</p>
                    <p>Max Score: {test.score}</p>
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
      )}

      {/* modal to start or continue attempt */}
      <Modal show={showModal} dismissible onClose={() => setShowModal(false)}>
        <Modal.Header>{!testIsLoading && <>{test.test.name}</>}</Modal.Header>
        <Modal.Body>
          <div>
            {testIsLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Spinner size="xl" />
              </div>
            ) : (
              <div>
                {test.test.description && (
                  <p className="mb-2 text-xl font-semibold">
                    {test.test.description}
                  </p>
                )}
                <div className="grid grid-cols-[max-content_auto] gap-x-3">
                  <span className="font-semibold">Time limit:</span>
                  <span>{test.test.time_limit}</span>
                  <span className="font-semibold">Max Score:</span>
                  <span>{test.test.score}</span>
                  <span className="font-semibold">Start date:</span>
                  <span>{formatDateTimeWithTime(test.test.start_date)}</span>
                  <span className="font-semibold">End date:</span>
                  <span>{formatDateTimeWithTime(test.test.end_date)}</span>
                </div>
                <Divider />
                <div>
                  <span className="font-semibold">Attempts used: </span>
                  <span>
                    {test.test.used_attempts}/{test.test.attempts}
                  </span>
                  <div
                    className={cn("grid items-baseline gap-2", {
                      "grid-cols-[max-content_max-content_max-content_max-content_auto]":
                        test.test.show_score_after_test,
                      "grid-cols-[max-content_max-content_auto]":
                        !test.test.show_score_after_test,
                    })}
                  >
                    {test.user_attempts.map((attempt, index) => (
                      <React.Fragment key={index}>
                        <span className="font-semibold">
                          Attempt {index + 1}
                        </span>
                        {test.test.show_score_after_test && (
                          <>
                            <span>|</span>
                            <span>{Number(attempt.score.toFixed(2))}</span>
                          </>
                        )}
                        <span>|</span>
                        <span>
                          {formatDateTimeWithTime(attempt.start_date)} -{" "}
                          {formatDateTimeWithTime(attempt.end_date)}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                {(test.test.used_attempts < test.test.attempts ||
                  test.test.in_progress) && (
                  <div className="mt-4">
                    {test.test.in_progress ? (
                      <Button onClick={() => continueTest(test.test.id)}>
                        Continue test
                      </Button>
                    ) : (
                      <Button onClick={() => startTest(test.test.id)}>
                        Start test
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Groups;
