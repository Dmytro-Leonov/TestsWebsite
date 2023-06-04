import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { Duration } from "luxon";

import { Button, TextInput, Select } from "flowbite-react";

import DisplayFieldErrors from "../../components/forms/DisplayFieldErrors";

import useTestsApi from "../../api/testsApi";

import parseError from "../../utils/parseError";
import { DateField } from "../../components/forms/DateField";
import { now, getLocalTimeZone } from "@internationalized/date";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

const TestSettings = () => {
  const testsApi = useTestsApi();
  const { id } = useParams();

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [testName, setTestName] = useState("");
  const [testNameErrors, setTestNameErrors] = useState([]);

  const [testDescription, setTestDescription] = useState("");
  const [testDescriptionErrors, setTestDescriptionErrors] = useState([]);

  const [testTimeLimit, setTestTimeLimit] = useState(
    Duration.fromObject({ hours: 0, minutes: 30, second: 0 })
  );
  const [testTimeLimitErrors, setTestTimeLimitErrors] = useState([]);

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const [testAttempts, setTestAttempts] = useState(1);
  const [testAttemptsErrors, setTestAttemptsErrors] = useState([]);

  const [score, setScore] = useState(10);
  const [scoreErrors, setScoreErrors] = useState([]);

  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleAnswers, setShuffleAnswers] = useState(true);
  const [showScoreAfterTest, setShowScoreAfterTest] = useState(false);
  const [showAnswersAfterTest, setShowAnswersAfterTest] = useState(false);
  // const [giveExtraTime, setGiveExtraTime] = useState(false);

  const [questionPool, setQuestionPool] = useState(null);
  const [group, setGroup] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [questions, setQuestions] = useState([]);

  const [canChangeSensitive, setCanChangeSensitive] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setIsLoading(true);
        const res = await testsApi.get(id);
        setTestName(res.name);
        setTestDescription(res.description);
        setTestTimeLimit(
          Duration.fromObject({
            hours: res.time_limit.split(":")[0],
            minutes: res.time_limit.split(":")[1],
            seconds: res.time_limit.split(":")[2],
          })
        );
        setStartDate(res.start_date);
        setEndDate(res.end_date);
        setTestAttempts(res.attempts);
        setScore(res.score);
        setQuestions(res.questions);
        setShuffleQuestions(res.shuffle_questions);
        setShuffleAnswers(res.shuffle_answers);
        setShowScoreAfterTest(res.show_score_after_test);
        setShowAnswersAfterTest(res.show_answers_after_test);
        // setGiveExtraTime(res.give_extra_time);
        setQuestionPool(res.question_pool);
        setGroup(res.group);
        setCanChangeSensitive(new Date() < new Date(res.start_date));
        setIsLoading(false);
      } catch (err) {
        navigate("/tests");
      }
    };
    fetchTest();
  }, []);

  const updateTest = async () => {
    try {
      setIsUpdating(true);
      const res = await testsApi.update(id, {
        name: testName,
        description: testDescription,
        time_limit: testTimeLimit.toFormat("hh:mm:ss"),
        attempts: testAttempts,
        score: score,
        shuffle_questions: shuffleQuestions,
        shuffle_answers: shuffleAnswers,
        show_score_after_test: showScoreAfterTest,
        show_answers_after_test: showAnswersAfterTest,
        // give_extra_time: giveExtraTime,
      });
      setIsUpdating(false);
      setTestName(res.name);
      setTestDescription(res.description);
      setTestTimeLimit(
        Duration.fromObject({
          hours: res.time_limit.split(":")[0],
          minutes: res.time_limit.split(":")[1],
          seconds: res.time_limit.split(":")[2],
        })
      );
      setTestAttempts(res.attempts);
      setScore(res.score);
      setShuffleQuestions(res.shuffle_questions);
      setShuffleAnswers(res.shuffle_answers);
      setShowScoreAfterTest(res.show_score_after_test);
      setShowAnswersAfterTest(res.show_answers_after_test);
      // setGiveExtraTime(res.give_extra_time);

      toast.success("Test updated successfully");
    } catch (err) {
      const { fields } = parseError(err);

      setTestNameErrors(fields.name || []);
      setTestDescriptionErrors(fields.description || []);
      setTestTimeLimitErrors(fields.time_limit || []);
      setTestAttemptsErrors(fields.attempts || []);
      setScoreErrors(fields.score || []);

      if (fields.__all__) setTestNameErrors(fields.__all__);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTest = async () => {
    try {
      setIsDeleting(true);
      await testsApi.delete(id);
      navigate(`/tests`);
    } catch (err) {
      console.log(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex w-full gap-5">
      <div className="flex w-2/3 flex-col gap-3">
        <h1 className="text-4xl font-bold">Test Questions</h1>
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="grid w-full grid-cols-[min-content_min-content_auto] gap-2 rounded-md border border-gray-500 p-2 hover:border-gray-700 hover:text-gray-700 dark:border-gray-400 dark:hover:border-white dark:hover:text-white [&>*]:flex [&>*]:items-center"
          >
            <span>{index + 1}</span>
            <div className="hover:bg-wite h-full w-[1px] rounded bg-gray-500 hover:bg-gray-700 dark:bg-gray-400 dark:hover:bg-white"></div>
            <div className="w-full min-w-full max-w-full">
              <div
                className="w-full min-w-full max-w-full break-words"
                dangerouslySetInnerHTML={{
                  __html: question.question,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <form className="flex w-1/3 flex-col items-center gap-4">
        <ConfirmationModal
          showModal={showDeleteModal}
          setShowModal={setShowDeleteModal}
          prompt={"Are you sure you want to delete this test?"}
          confirmText={"Delete"}
          rejectText={"Cancel"}
          onClick={() => deleteTest()}
        />
        <h1 className="text-4xl font-bold">Update test settings</h1>
        <div className="w-full">
          <p className=" text-lg">Name</p>
          <DisplayFieldErrors errors={testNameErrors} />
          <TextInput
            value={testName}
            onInput={(e) => setTestName(e.target.value)}
          ></TextInput>
        </div>
        <div className="w-full">
          <p className=" text-lg">Description</p>
          <DisplayFieldErrors errors={testDescriptionErrors} />
          <textarea
            id="emails"
            rows="3"
            className="block max-h-[200px] w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            value={testDescription}
            onInput={(e) => setTestDescription(e.target.value)}
          ></textarea>
        </div>
        {questionPool && (
          <div className="w-full">
            <p className=" text-lg">Question Pool</p>
            <p className="text-md mt-2 rounded-lg border-l p-3">
              {questionPool.name}
            </p>
          </div>
        )}
        {
          // for group
          group && (
            <div className="w-full">
              <p className=" text-lg">Group</p>
              <p className="text-md mt-2 rounded-lg border-l p-3">
                {group.name}
              </p>
            </div>
          )
        }

        <div className="w-full">
          <p className=" text-lg">Time limit</p>
          <DisplayFieldErrors errors={testTimeLimitErrors} />
          <div className="grid grid-cols-3 gap-2">
            <TextInput
              disabled={!canChangeSensitive}
              type="number"
              addon="hours"
              value={testTimeLimit.hours}
              onInput={(e) => {
                let value = Math.abs(+e.target.value || 0);
                if (value > 24) {
                  value = 24;
                }
                setTestTimeLimit(
                  Duration.fromObject({
                    hours: value,
                    minutes: testTimeLimit.minutes,
                    seconds: testTimeLimit.seconds,
                  })
                );
              }}
            />
            <TextInput
              disabled={!canChangeSensitive}
              type="number"
              addon="mins"
              value={testTimeLimit.minutes}
              onInput={(e) => {
                let value = Math.abs(+e.target.value || 0);
                if (value > 59) {
                  value = 59;
                }
                setTestTimeLimit(
                  Duration.fromObject({
                    hours: testTimeLimit.hours,
                    minutes: value,
                    seconds: testTimeLimit.seconds,
                  })
                );
              }}
            />
            <TextInput
              disabled={!canChangeSensitive}
              type="number"
              addon="secs"
              value={testTimeLimit.seconds}
              onInput={(e) => {
                let value = Math.abs(+e.target.value || 0);
                if (value > 59) {
                  value = 59;
                }
                setTestTimeLimit(
                  Duration.fromObject({
                    hours: testTimeLimit.hours,
                    minutes: testTimeLimit.minutes,
                    seconds: value,
                  })
                );
              }}
            />
          </div>
        </div>
        <div className="w-full">
          <p className=" text-lg">Start date</p>
          {startDate && (
            <p className="text-md mt-2 rounded-lg border-l p-3">
              {startDate.replace("T", " ").slice(0, -3)}
            </p>
          )}
        </div>
        <div className="w-full">
          <p className=" text-lg">End date</p>
          {endDate && (
            <p className="text-md mt-2 rounded-lg border-l p-3">
              {endDate.replace("T", " ").slice(0, -3)}
            </p>
          )}
        </div>
        <div className="w-full">
          <p className=" text-lg">Attempts</p>
          <DisplayFieldErrors errors={testAttemptsErrors} />
          <Select
            disabled={!canChangeSensitive}
            value={testAttempts}
            onChange={(e) => setTestAttempts(e.target.value)}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
          </Select>
        </div>

        <div className="w-full">
          <p className=" text-lg">Score</p>
          <DisplayFieldErrors errors={scoreErrors} />
          <TextInput
            disabled={!canChangeSensitive}
            type="number"
            max={1000}
            value={score}
            onInput={(e) => {
              let value = Math.abs(+e.target.value || 0);
              setScore(value);
            }}
          ></TextInput>
        </div>

        <div className="w-full">
          <p className=" text-lg">Shuffle questions</p>
          <Select
            disabled={!canChangeSensitive}
            value={shuffleQuestions}
            onChange={(e) => setShuffleQuestions(e.target.value)}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </Select>
        </div>

        <div className="w-full">
          <p className=" text-lg">Shuffle answers</p>
          <Select
            disabled={!canChangeSensitive}
            value={shuffleAnswers}
            onChange={(e) => setShuffleAnswers(e.target.value)}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </Select>
        </div>

        <div className="w-full">
          <p className=" text-lg">Show score after test</p>
          <Select
            disabled={!canChangeSensitive}
            value={showScoreAfterTest}
            onChange={(e) => setShowScoreAfterTest(e.target.value)}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </Select>
        </div>

        <div className="w-full">
          <p className=" text-lg">Show answers after test</p>
          <Select
            disabled={!canChangeSensitive}
            value={showAnswersAfterTest}
            onChange={(e) => setShowAnswersAfterTest(e.target.value)}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </Select>
        </div>

        {/* <div className="w-full">
          <p className=" text-lg">Give extra time</p>
          <Select
            value={giveExtraTime}
            onChange={(e) => setGiveExtraTime(e.target.value)}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </Select>
        </div> */}

        <Button
          size={"md"}
          className="w-full"
          isProcessing={isUpdating}
          onClick={() => updateTest()}
        >
          Update
        </Button>
        <Button
          size={"md"}
          color={"red"}
          className="w-full"
          isProcessing={isDeleting}
          onClick={() => setShowDeleteModal(true)}
        >
          Delete
        </Button>
      </form>
    </div>
  );
};

export default TestSettings;
