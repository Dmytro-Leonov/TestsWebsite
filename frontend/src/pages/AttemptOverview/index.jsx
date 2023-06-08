import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTestsApi from "../../api/testsApi";

import { Spinner } from "flowbite-react";
import Divider from "../../components/ui/Divider";
import { formatTime } from "../../utils/formatDateTime";

const AttemptOverview = () => {
  const { testId, attemptId } = useParams();
  const testsApi = useTestsApi();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [test, setTest] = useState(null);
  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    const attemptOverview = async () => {
      try {
        setIsLoading(true);
        const res = await testsApi.attemptOverview(testId, attemptId);
        setTest(res.test);
        setAttempt(res.attempt);
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
          <h2 className="font-bold">Logs</h2>
          {
            attempt.logs.map((log) => (
              <></>
            ))
          }
        </div>
      )}
    </>
  );
};

export default AttemptOverview;
