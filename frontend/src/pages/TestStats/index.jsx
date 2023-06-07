import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTestsApi from "../../api/testsApi";

import { Spinner, Tooltip, Radio, Checkbox } from "flowbite-react";
import Divider from "../../components/ui/Divider";
import PercentageSwitch from "./PercentageSwitch";

const TestStats = () => {
  const { testId } = useParams();
  const testsApi = useTestsApi();
  const navigate = useNavigate();

  const [marksShowPercentages, setMarksShowPercentages] = useState(false);
  const [timeTakenShowPercentages, setTimeTakenShowPercentages] =
    useState(false);
  const [questionsShowPercentages, setQuestionsShowPercentages] =
    useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [testStats, setTestStats] = useState(null);

  useEffect(() => {
    const getTestStats = async () => {
      // do try catch with redirect to /
      try {
        setIsLoading(true);
        const testStats = await testsApi.stats(testId);
        setTestStats(testStats);
      } catch (err) {
        if (err.response.status === 403 || err.response.status === 404)
          navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    getTestStats();
  }, [testId]);

  // count of correct answers for each question
  // count of incorrect answers for each question
  // count of times each answer was selected / total answers

  const getPercentage = (num, total, round = false) => {
    return (
      Number(((num / total) * 100).toFixed(round ? 0 : 2)).toString() + "%"
    );
  };

  const formatTime = (time) => {
    time = time.split(".")[0];
    const splitTime = time.split(":").map((n) => Number(n));
    const hours = splitTime[0];
    const minutes = splitTime[1];
    const seconds = splitTime[2];

    let res = "";
    if (hours) res += `${hours}h`;
    if (minutes) res += ` ${minutes}m`;
    if (seconds) res += ` ${seconds}s`;

    return res;
  };

  const timeToSeconds = (time) => {
    return time[0] * 3600 + time[1] * 60 + time[2];
  };

  const timeToPercentage = (time, total) => {
    time = timeToSeconds(
      time
        .split(".")[0]
        .split(":")
        .map((n) => Number(n))
    );
    total = timeToSeconds(
      total
        .split(".")[0]
        .split(":")
        .map((n) => Number(n))
    );
    return getPercentage(time, total);
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex w-full justify-center">
          <Spinner size={"xl"} />
        </div>
      ) : (
        <>
          {testStats ? (
            <>
              <h1 className="font-bold">{testStats.test.name}</h1>
              <Divider />
              <h3 className="mb-2 font-bold">Statistics</h3>
              <div className="flex flex-col gap-4">
                <div className="relative w-min rounded border border-gray-500 p-2 dark:border-gray-400">
                  <PercentageSwitch
                    showPercentages={questionsShowPercentages}
                    setShowPercentages={setQuestionsShowPercentages}
                  />
                  <h2 className="font-bold">
                    Questions of all finished attempts
                  </h2>
                  <div className="grid grid-cols-[max-content_max-content_max-content_max-content] gap-x-5 text-lg">
                    <span>All questions</span>
                    <span>Correctly answered</span>
                    <span>Incorrectly answered</span>
                    <span>Not answered</span>

                    <span>
                      {questionsShowPercentages
                        ? "100%"
                        : testStats.test.total_questions_answered}
                    </span>
                    <span>
                      {questionsShowPercentages
                        ? getPercentage(
                            testStats.test.correctly_answered_questions,
                            testStats.test.total_questions_answered
                          )
                        : testStats.test.correctly_answered_questions}
                    </span>
                    <span>
                      {questionsShowPercentages
                        ? getPercentage(
                            testStats.test.incorrectly_answered_questions,
                            testStats.test.total_questions_answered
                          )
                        : testStats.test.incorrectly_answered_questions}
                    </span>
                    <span>
                      {questionsShowPercentages
                        ? getPercentage(
                            testStats.test.not_answered_questions,
                            testStats.test.total_questions_answered
                          )
                        : testStats.test.not_answered_questions}
                    </span>
                  </div>
                </div>
                <div className="relative w-min rounded border border-gray-500 p-2 dark:border-gray-400">
                  <PercentageSwitch
                    showPercentages={marksShowPercentages}
                    setShowPercentages={setMarksShowPercentages}
                  />
                  <h2 className="font-bold">Mark</h2>
                  <div className="grid grid-cols-[max-content_max-content_max-content_max-content] gap-x-5 text-lg">
                    <span>Max possible</span>
                    <span>Min</span>
                    <span>Max</span>
                    <span>Avg</span>

                    <span>
                      {marksShowPercentages ? "100%" : testStats.test.score}
                    </span>
                    <span>
                      {marksShowPercentages
                        ? getPercentage(
                            testStats.attempts.min_score,
                            testStats.test.score
                          )
                        : testStats.attempts.min_score}
                    </span>
                    <span>
                      {marksShowPercentages
                        ? getPercentage(
                            testStats.attempts.max_score,
                            testStats.test.score
                          )
                        : testStats.attempts.max_score}
                    </span>
                    <span>
                      {marksShowPercentages
                        ? getPercentage(
                            testStats.attempts.avg_score,
                            testStats.test.score
                          )
                        : testStats.attempts.avg_score.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="relative w-min rounded border border-gray-500 p-2 dark:border-gray-400">
                  <PercentageSwitch
                    showPercentages={timeTakenShowPercentages}
                    setShowPercentages={setTimeTakenShowPercentages}
                  />
                  <h2 className="font-bold">Time taken</h2>
                  <div className="grid grid-cols-[max-content_max-content_max-content_max-content] gap-x-5 text-lg">
                    <span>Max possible</span>
                    <span>Min</span>
                    <span>Max</span>
                    <span>Avg</span>

                    <span>
                      {timeTakenShowPercentages
                        ? "100%"
                        : formatTime(testStats.test.time_limit)}
                    </span>
                    <span>
                      {timeTakenShowPercentages
                        ? timeToPercentage(
                            testStats.attempts.min_time_taken,
                            testStats.test.time_limit
                          )
                        : formatTime(testStats.attempts.min_time_taken)}
                    </span>
                    <span>
                      {timeTakenShowPercentages
                        ? timeToPercentage(
                            testStats.attempts.max_time_taken,
                            testStats.test.time_limit
                          )
                        : formatTime(testStats.attempts.max_time_taken)}
                    </span>
                    <span>
                      {timeTakenShowPercentages
                        ? timeToPercentage(
                            testStats.attempts.avg_time_taken,
                            testStats.test.time_limit
                          )
                        : formatTime(testStats.attempts.avg_time_taken)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <Divider />
                <h3 className="mb-2 font-bold">Test Questions</h3>
                <div className="mb-2 flex flex-row flex-wrap gap-4">
                  <div className="flex gap-2">
                    <div className="h-5 w-5 rounded-full bg-emerald-500" />
                    <span>Correctly answered</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-5 w-5 rounded-full bg-rose-600" />
                    <span>Incorrectly answered</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-5 w-5 rounded-full bg-gray-400" />
                    <span>Not answered</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {testStats.questions.map((question) => {
                    const totalAnswers =
                      question.correctly_answered +
                      question.incorrectly_answered +
                      question.not_answered;
                    const answersSum = question.answers.reduce(
                      (acc, answer) => acc + answer.chosen,
                      0
                    );
                    return (
                      <div
                        key={question.id}
                        className="flex flex-col gap-1 rounded border border-gray-500 p-2 dark:border-gray-400"
                      >
                        <div className="grid grid-cols-[max-content_auto] gap-2">
                          <div></div>
                          <div className="min-w-full">
                            <div
                              className="break-words"
                              dangerouslySetInnerHTML={{
                                __html: question.question,
                              }}
                            ></div>
                          </div>
                          {question.answers.map((answer, index) => (
                            <React.Fragment key={answer.id}>
                              <div>
                                {question.type === "SINGLE_CHOICE" ? (
                                  <Radio checked={answer.is_correct} disabled />
                                ) : (
                                  <Checkbox
                                    checked={answer.is_correct}
                                    disabled
                                  />
                                )}
                              </div>
                              <div className="flex min-w-full flex-col gap-2">
                                <div
                                  className="break-words"
                                  dangerouslySetInnerHTML={{
                                    __html: answer.answer,
                                  }}
                                />
                                <div>
                                  <span>Times Selected: </span>
                                  <span className="font-semibold">
                                    {answer.chosen} ({getPercentage(answer.chosen, answersSum)})
                                  </span>
                                </div>
                              </div>
                              <div></div>
                              {question.answers.length - 1 !== index && (
                                <Divider className="!my-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        <div className="mt-2 flex h-5 w-full overflow-hidden rounded">
                          <div
                            className="bg-emerald-500 [&>*:first-child]:!w-full"
                            style={{
                              width: getPercentage(
                                question.correctly_answered,
                                totalAnswers,
                                true
                              ),
                            }}
                          >
                            <Tooltip
                              content={`Correctly answered: ${
                                question.correctly_answered
                              } (${getPercentage(
                                question.correctly_answered,
                                totalAnswers,
                                true
                              )})`}
                            >
                              &nbsp;
                            </Tooltip>
                          </div>

                          <div
                            className="bg-rose-600 [&>*:first-child]:!w-full"
                            style={{
                              width: getPercentage(
                                question.incorrectly_answered,
                                totalAnswers,
                                true
                              ),
                            }}
                          >
                            <Tooltip
                              content={`Incorrectly answered: ${
                                question.incorrectly_answered
                              } (${getPercentage(
                                question.incorrectly_answered,
                                totalAnswers,
                                true
                              )})`}
                            >
                              &nbsp;
                            </Tooltip>
                          </div>

                          <div
                            className="bg-gray-400 [&>*:first-child]:!w-full"
                            style={{
                              width: getPercentage(
                                question.not_answered,
                                totalAnswers,
                                true
                              ),
                            }}
                          >
                            <Tooltip
                              content={`Not answered: ${
                                question.not_answered
                              } (${getPercentage(
                                question.not_answered,
                                totalAnswers,
                                true
                              )})`}
                            >
                              &nbsp;
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div>
              <h1 className="font-bold">No attempts were made yet</h1>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TestStats;
