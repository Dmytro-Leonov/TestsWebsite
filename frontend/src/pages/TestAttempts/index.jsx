import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Spinner, Accordion } from "flowbite-react";
import Divider from "../../components/ui/Divider";
import useTestsApi from "../../api/testsApi";
import { formatDateTimeWithTime, formatTime } from "../../utils/formatDateTime";

const TestAttempts = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const testsApi = useTestsApi();

  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [test, setTest] = useState(null);

  useEffect(() => {
    const fetchUserAnswers = async () => {
      setIsLoading(true);
      const res = await testsApi.attempts(testId);
      setUsers(res.users);
      setTest(res.test);
      setIsLoading(false);
    };
    try {
      fetchUserAnswers();
    } catch (err) {
      navigate("/");
    }
  }, [testId]);

  const getMaxAndMinScore = (attempts) => {
    return attempts.length === 0
      ? [null, null]
      : [
          attempts.reduce(
            (max, attempt) => (attempt.score > max ? attempt.score : max),
            -Infinity
          ),
          attempts.reduce(
            (min, attempt) => (attempt.score < min ? attempt.score : min),
            Infinity
          ),
        ];
  };

  return (
    <>
      {isLoading ? (
        <div className="flex grow items-center justify-center">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="w-full">
          <h1 className="mb-3 text-3xl font-bold">{test.name}</h1>
          <Divider />
          <Accordion alwaysOpen={true} collapseAll={true}>
            {users.map((user) => {
              const [maxScore, minScore] = getMaxAndMinScore(user.attempts_set);
              return (
                <Accordion.Panel hidden key={user.id}>
                  <Accordion.Title className="focus:!ring-0 dark:focus:ring-0 [&>*:first-child]:w-full">
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center gap-2">
                        <div>{user.full_name}</div>
                        <div>
                          {user.has_ongoing_attempt && (
                            <div className="rounded bg-green-500 p-1 text-sm text-white">
                              Currently making an attempt
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {test.attempts === 1 ? (
                          <div>Score: {maxScore}</div>
                        ) : (
                          user.attempts_set.length !== 0 && (
                            <div>
                              Worst attempt: {Number(minScore.toFixed(2))} /
                              Best Attempt: {Number(maxScore.toFixed(2))}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </Accordion.Title>
                  <Accordion.Content>
                    {
                      user.attempts_set.length !== 0 ? (
                      <div className="grid grid-cols-[max-content_max-content_max-content_max-content_max-content_max-content] gap-x-8">
                      <div>№</div>
                      <div>Score</div>
                      <div>Time taken</div>
                      <div>Start date</div>
                      <div>End date</div>
                      <div></div>
                      {user.attempts_set.map((attempt, index) => (
                        <React.Fragment key={index}>
                          <span className="font-semibold">
                            {index + 1}
                          </span>
                          <span>{Number(attempt.score.toFixed(2))}</span>
                          <span>{formatTime(attempt.time_taken)}</span>
                          <span>
                            {formatDateTimeWithTime(attempt.start_date)}
                          </span>
                          <span>
                            {formatDateTimeWithTime(attempt.end_date)}
                          </span>
                          <Link to={`${attempt.id}`} className="text-blue-700 hover:text-blue-800 underline">View</Link>
                        </React.Fragment>
                      ))}
                    </div>)
                      : "No attempts yet"
                    }
                    
                  </Accordion.Content>
                </Accordion.Panel>
              );
            })}
          </Accordion>
        </div>
      )}
    </>
  );
};

export default TestAttempts;
