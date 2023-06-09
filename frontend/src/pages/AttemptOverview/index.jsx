import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTestsApi from "../../api/testsApi";
import { default as cn } from "classnames";

import { Spinner, Checkbox, Radio } from "flowbite-react";
import Divider from "../../components/ui/Divider";
import { formatTime, formatDateTimeWithTime } from "../../utils/formatDateTime";
import actionTypes from "../../data/actionTypes";

const AttemptOverview = () => {
  const { testId, attemptId } = useParams();
  const testsApi = useTestsApi();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [test, setTest] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);

  let lastQuestinType = null;

  useEffect(() => {
    const attemptOverview = async () => {
      try {
        setIsLoading(true);
        const res = await testsApi.attemptOverview(testId, attemptId);
        setTest(res.test);
        setAttempt(res.attempt);
        setQuestions(res.questions);
        setIsLoading(false);
      } catch (err) {
        navigate("/");
      }
    };

    attemptOverview();
  }, [testId, attemptId]);

  return (
    <>
      {isLoading ? (
        <div className="flex grow items-center justify-center">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="w-full">
          <h1 className="font-bold">{test.name}</h1>
          <Divider />
          <div className="grid grid-cols-[max-content_max-content] items-baseline gap-x-5">
            <span>Student: </span>
            <span className="text-lg font-semibold">
              {attempt.user.full_name}
            </span>
            <span>Score: </span>
            <span className="text-lg font-semibold">
              {Number(attempt.score.toFixed(2))} / {test.score}
            </span>
            <span>Time taken: </span>
            <span className="text-lg font-semibold">
              {formatTime(attempt.time_taken)}
            </span>
            <span>Start date:</span>
            <span className="text-lg font-semibold">
              {new Date(attempt.start_date).toLocaleString()}
            </span>
            <span>End date:</span>
            <span className="text-lg font-semibold">
              {new Date(attempt.end_date).toLocaleString()}
            </span>
          </div>
          <Divider />
          <h2 className="mb-4 font-bold">Questions</h2>
          <div className="flex flex-wrap gap-5">
            <div className="flex gap-2">
              <div className="flex gap-2">
                <Radio checked={true} disabled />
                <Checkbox checked={true} disabled />
              </div>
              <p>Correct answer</p>
            </div>
            <div className="mb-4 flex gap-2">
              <div className="flex h-5 w-5 overflow-hidden rounded-full">
                <div className="h-full w-1/2 bg-emerald-600"></div>
                <div className="h-full w-1/2 bg-rose-600"></div>
              </div>
              <p>Selected right / wrong</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {questions.map((question) => {
              return (
                <div
                  key={question.id}
                  className="flex flex-col gap-1 rounded border border-gray-500 p-2 dark:border-gray-400"
                >
                  <div className="grid grid-cols-[max-content_auto] gap-2">
                    <div></div>
                    <div className="min-w-full">
                      <h2>№ {question.order}</h2>
                      <div
                        className="break-words"
                        dangerouslySetInnerHTML={{
                          __html: question.question,
                        }}
                      ></div>
                    </div>
                    {question.answers.map((answer) => (
                      <React.Fragment key={answer.id}>
                        <div>
                          {question.type === "SINGLE_CHOICE" ? (
                            <Radio checked={answer.is_correct} disabled />
                          ) : (
                            <Checkbox checked={answer.is_correct} disabled />
                          )}
                        </div>
                        <div
                          className={cn(
                            "flex min-w-full flex-col gap-2 rounded px-1",
                            {
                              "bg-rose-600 text-gray-200":
                                !answer.is_correct && answer.is_selected,
                              "bg-emerald-600 text-gray-200":
                                answer.is_correct && answer.is_selected,
                            }
                          )}
                        >
                          <div
                            className="break-words"
                            dangerouslySetInnerHTML={{
                              __html: answer.answer,
                            }}
                          />
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <Divider />
          <h2 className="mb-2 font-bold">Logs</h2>
          <div className="flex flex-col gap-2">
            {attempt.logs.map((log) => {
              lastQuestinType = log?.question?.type || lastQuestinType;
              return (
                <div key={log.id}>
                  <div className="min-w-full rounded border border-gray-500 p-2 dark:border-gray-400">
                    {(log.action === "ENTERED_QUESTION" ||
                      log.action === "MARKED_AS_ANSWERED" ||
                      log.action === "UNMARKED_AS_ANSWERED") && (
                      <>
                        <div>
                          <span className="text-lg font-semibold">
                            {formatDateTimeWithTime(log.created_at)} |{" "}
                            {actionTypes[log.action]} {log.question.order}
                          </span>
                          <Divider className={"!my-1"} />
                        </div>
                        <div
                          className="break-words"
                          dangerouslySetInnerHTML={{
                            __html: log.question.question,
                          }}
                        />
                      </>
                    )}
                    {(log.action === "DESELECTED_ANSWER" ||
                      log.action === "SELECTED_ANSWER") && (
                      <>
                        <div>
                          <span className="text-lg font-semibold">
                            {formatDateTimeWithTime(log.created_at)} |{" "}
                            {actionTypes[log.action]}
                          </span>
                          <Divider className={"!my-1"} />
                        </div>
                        <div className="flex gap-2">
                          <div>
                            {lastQuestinType === "SINGLE_CHOICE" && (
                              <Radio
                                checked={log.action === "SELECTED_ANSWER"}
                                disabled
                              />
                            )}
                            {lastQuestinType === "MULTIPLE_CHOICE" && (
                              <Checkbox
                                checked={log.action === "SELECTED_ANSWER"}
                                disabled
                              />
                            )}
                          </div>
                          <div
                            className="break-words"
                            dangerouslySetInnerHTML={{
                              __html: log.answer.answer,
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default AttemptOverview;
