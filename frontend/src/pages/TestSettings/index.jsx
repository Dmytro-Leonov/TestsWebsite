import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { Duration } from "luxon";

import { Button, TextInput, Select } from "flowbite-react";

import DisplayFieldErrors from "../../components/forms/DisplayFieldErrors";

import useTestsApi from "../../api/testsApi";

import parseError from "../../utils/parseError";

const TestSettings = () => {
  const testsApi = useTestsApi();
  const { id } = useParams();

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [testName, setTestName] = useState("");
  const [testNameErrors, setTestNameErrors] = useState([]);

  const [testDescription, setTestDescription] = useState("");
  const [testDescriptionErrors, setTestDescriptionErrors] = useState([]);

  const [testTimeLimit, setTestTimeLimit] = useState(
    Duration.fromObject({ hours: 0, minutes: 30, second: 0 })
  );
  const [testTimeLimitErrors, setTestTimeLimitErrors] = useState([]);

  const [testAttempts, setTestAttempts] = useState(1);
  const [testAttemptsErrors, setTestAttemptsErrors] = useState([]);

  const [score, setScore] = useState(10);
  const [scoreErrors, setScoreErrors] = useState([]);

  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleAnswers, setShuffleAnswers] = useState(true);
  const [showScoreAfterTest, setShowScoreAfterTest] = useState(false);
  const [showAnswersAfterTest, setShowAnswersAfterTest] = useState(false);
  const [giveExtraTime, setGiveExtraTime] = useState(false);

  const [questionPool, setQuestionPool] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
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
        setTestAttempts(res.attempts);
        setScore(res.score);
        setShuffleQuestions(res.shuffle_questions);
        setShuffleAnswers(res.shuffle_answers);
        setShowScoreAfterTest(res.show_score_after_test);
        setShowAnswersAfterTest(res.show_answers_after_test);
        setGiveExtraTime(res.give_extra_time);
        setQuestionPool(res.question_pool);
      } catch (err) {
        navigate("/tests");
      }
    };
    fetchTest();
  }, []);

  const createTest = async () => {
    try {
      setIsLoading(true);
      const res = await testsApi.create({
        question_pool: questionPool,
        name: testName,
        description: testDescription,
        time_limit: testTimeLimit.toFormat("hh:mm:ss"),
        attempts: testAttempts,
        score: score,
        shuffle_questions: shuffleQuestions,
        shuffle_answers: shuffleAnswers,
        show_score_after_test: showScoreAfterTest,
        show_answers_after_test: showAnswersAfterTest,
        give_extra_time: giveExtraTime,
      });

      navigate(`/tests/${res.id}`);
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
      setIsLoading(true);
      await testsApi.delete(id);
      navigate(`/tests`);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">Create new test</h1>
        <div className="w-1/2 min-w-[300px] max-w-[450px]">
          <p className=" text-lg">Name</p>
          <DisplayFieldErrors errors={testNameErrors} />
          <TextInput
            value={testName}
            onInput={(e) => setTestName(e.target.value)}
          ></TextInput>
        </div>
        <div className="w-1/2 min-w-[300px] max-w-[450px]">
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
        <div className="w-1/2 min-w-[300px] max-w-[450px]">
          <p className=" text-lg">Question Pool</p>
          {questionPool && <>{questionPool.name}</>}
        </div>
        <div className="w-1/2 min-w-[300px] max-w-[450px]">
          <p className=" text-lg">Time limit</p>
          <DisplayFieldErrors errors={testTimeLimitErrors} />
          <div className="grid grid-cols-3 gap-2">
            <TextInput
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
        <div className="w-1/2 min-w-[300px] max-w-[450px]">
          <p className=" text-lg">Attempts</p>
          <DisplayFieldErrors errors={testAttemptsErrors} />
          <Select
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

        <div className="w-1/2 min-w-[300px] max-w-[450px]">
          <p className=" text-lg">Score</p>
          <DisplayFieldErrors errors={scoreErrors} />
          <TextInput
            type="number"
            max={1000}
            value={score}
            onInput={(e) => {
              let value = Math.abs(+e.target.value || 0);
              setScore(value);
            }}
          ></TextInput>
        </div>

        <div className="w-1/2 min-w-[300px] max-w-[450px]">
          <p className=" text-lg">Shuffle questions</p>
          <Select
            value={shuffleQuestions}
            onChange={(e) => setShuffleQuestions(e.target.value)}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </Select>
        </div>

        <div className="w-1/2 min-w-[300px] max-w-[450px]">
          <p className=" text-lg">Shuffle answers</p>
          <Select
            value={shuffleAnswers}
            onChange={(e) => setShuffleAnswers(e.target.value)}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </Select>
        </div>

        <div className="w-1/2 min-w-[300px] max-w-[450px]">
          <p className=" text-lg">Show score after test</p>
          <Select
            value={showScoreAfterTest}
            onChange={(e) => setShowScoreAfterTest(e.target.value)}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </Select>
        </div>

        <div className="w-1/2 min-w-[300px] max-w-[450px]">
          <p className=" text-lg">Show answers after test</p>
          <Select
            value={showAnswersAfterTest}
            onChange={(e) => setShowAnswersAfterTest(e.target.value)}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </Select>
        </div>

        <div className="w-1/2 min-w-[300px] max-w-[450px]">
          <p className=" text-lg">Give extra time</p>
          <Select
            value={giveExtraTime}
            onChange={(e) => setGiveExtraTime(e.target.value)}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </Select>
        </div>

        <Button
          size={"md"}
          className="w-1/2 min-w-[300px] max-w-[450px]"
          isProcessing={isLoading}
          onClick={() => createTest()}
        >
          Update
        </Button>
        <Button
          size={"md"}
          color={"red"}
          className="w-1/2 min-w-[300px] max-w-[450px]"
          isProcessing={isLoading}
          onClick={() => deleteTest()}
        >
          Delete
        </Button>


      </form>
    </div>
  );
};

export default TestSettings;
