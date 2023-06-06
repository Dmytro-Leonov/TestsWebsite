import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useTestsApi from "../../api/testsApi";
import { Button, Spinner, Radio, Checkbox } from "flowbite-react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

import QuestionCard from "./QuestionCard";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import parseError from "../../utils/parseError";
import { toast } from "react-toastify";
import Countdown from "react-countdown";

const Attempt = () => {
  const { testId, attemptId, questionNumber } = useParams();
  const testsApi = useTestsApi();
  const navigate = useNavigate();

  const [isLoadingAllQuestions, setIsLoadingAllQuestions] = useState(true);
  const [allQuestions, setAllQuestions] = useState([]);

  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  const [isLoadingAttempt, setIsLoadingAttempt] = useState(true);
  const [attempt, setAttempt] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        setIsLoadingAttempt(true);
        const attemptRes = await testsApi.attemptDetails(attemptId);
        setAttempt(attemptRes);
        setIsLoadingAttempt(false);
      } catch (error) {
        navigate("/");
      }
    };
    fetchAttempt();
  }, [attemptId]);

  useEffect(() => {
    const fetchAllQuestions = async () => {
      setIsLoadingAllQuestions(true);
      const allQuestionsRes = await testsApi.getAttemptQuestions(attemptId);
      setAllQuestions(allQuestionsRes);
      setIsLoadingAllQuestions(false);
    };
    fetchAllQuestions();
  }, []);

  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoadingQuestion(true);
      const questionRes = await testsApi.getAttemptQuestion(
        attemptId,
        questionNumber
      );
      setQuestion(questionRes.question);
      setAnswers(questionRes.answers);
      setIsLoadingQuestion(false);
    };
    if (attemptId && questionNumber) fetchQuestion();
  }, [attemptId, questionNumber]);

  const selectAnswer = (index) => {
    let ans;
    let newAnswers = structuredClone(answers);
    if (question.question_type === "SINGLE_CHOICE") {
      newAnswers.forEach((answer) => (answer.is_selected = false));
      newAnswers[index].is_selected = true;
      ans = true;
      // make reqeust to update answer
    }
    if (question.question_type === "MULTIPLE_CHOICE") {
      newAnswers[index].is_selected = !newAnswers[index].is_selected;
      ans = newAnswers[index].is_selected;
      // make reqeust to update answer
    }

    setAnswers(newAnswers);
    let hasAnswer = false;
    for (let i = 0; i < newAnswers.length; i++) {
      if (newAnswers[i].is_selected) {
        hasAnswer = true;
        break;
      }
    }
    return [hasAnswer, ans];
  };

  const updateQuestions = (hasAnswer) => {
    const newQuestions = structuredClone(allQuestions);
    for (let i = 0; i < newQuestions.length; i++) {
      if (newQuestions[i].id !== question.id) continue;
      newQuestions[i].has_answer = hasAnswer;
      break;
    }
    setAllQuestions(newQuestions);
  };

  const selectAnswerRequest = async (index, ans) => {
    const Id = answers[index].id;
    try {
      await testsApi.selectAnswer(Id, { selected: ans });
    } catch (error) {
      const { all_field_errors } = parseError(error);
      toast.error(all_field_errors[0]);
    }
  };

  const onChangeAnswer = (index) => {
    const [hasAnswer, ans] = selectAnswer(index);
    updateQuestions(hasAnswer);
    selectAnswerRequest(index, ans);
  };

  const markQuestionAsAnswered = async (answered) => {
    try {
      await testsApi.markQuestionAsAnswered(question.id, {
        answered: answered,
      });

      const questionCopy = structuredClone(question);
      questionCopy.marked_as_answered = answered;
      setQuestion(questionCopy);

      const newQuestions = structuredClone(allQuestions);
      for (let i = 0; i < newQuestions.length; i++) {
        if (newQuestions[i].id !== question.id) continue;
        newQuestions[i].marked_as_answered = answered;
        break;
      }
      setAllQuestions(newQuestions);
    } catch (error) {
      const { all_field_errors } = parseError(error);
      toast.error(all_field_errors[0]);
    }
  };

  const finishAttempt = async () => {
    try {
      await testsApi.finishAttempt(attemptId);
    } catch (error) {
      console.log(error);
    } finally {
      navigate(`/tests?tab=to-complete`);
    }
  };

  const formatTime = (t) => {
    if (t < 10) return `0${t}`;
    return t;
  }

  const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      finishAttempt()
      return <span className="text-2xl font-bold">Time is out</span>;
    } else {
      // Render a countdown
      return (
        <span className="text-2xl font-bold">
          {
            hours !== 0 ? `${formatTime(hours)}:` : ''
          }
          {
            minutes !== 0 ? `${formatTime(minutes)}:` : ''
          }
          {formatTime(seconds)}
        </span>
      );
    }
  };

  return (
    <>
      {isLoadingAttempt ? (
        <div className="grid w-full place-items-center">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="w-full">
          <div className="flex items-center justify-between">
            <h1 className="mb-2 font-bol">{attempt.test.name}</h1>
            <Countdown date={Date.now() + new Date(attempt.end_date).getTime() - new Date().getTime()} renderer={countdownRenderer} />
          </div>
          {!isLoadingAllQuestions && (
            <div className="mb-3 grid w-full grid-cols-[auto_min-content_max-content] gap-2 rounded border border-gray-500 p-2 dark:border-gray-400">
              <div className="flex flex-wrap gap-2">
                {allQuestions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    id={q.id}
                    testId={testId}
                    attemptId={attemptId}
                    order={q.order}
                    hasAnswer={q.has_answer}
                    markedAsAnswered={q.marked_as_answered}
                    isCurrent={q.id === question?.id}
                    // enabled={question.enabled}
                  />
                ))}
              </div>
              <div className="h-full w-[1px] rounded bg-gray-500 dark:bg-gray-400"></div>
              <Button onClick={() => setShowConfirmModal(true)}>
                Finish attempt
              </Button>
            </div>
          )}
          <div className="rounded border border-gray-500 p-2 dark:border-gray-400">
            {isLoadingQuestion ? (
              <div className="grid w-full place-items-center">
                <Spinner size="xl" />
              </div>
            ) : (
              <>
                <div
                  className="mb-3 w-full break-words"
                  dangerouslySetInnerHTML={{
                    __html: question.question_html,
                  }}
                />
                <fieldset className="flex flex-col gap-2">
                  {answers.map((answer, index) => (
                    <div
                      key={answer.id}
                      className="flex w-full items-center gap-2"
                    >
                      {question.question_type === "SINGLE_CHOICE" ? (
                        <Radio
                          name="answer"
                          value={answer.id}
                          checked={answer.is_selected}
                          onChange={() => onChangeAnswer(index)}
                          id={answer.id}
                        />
                      ) : (
                        <Checkbox
                          name="answer"
                          value={answer.id}
                          checked={answer.is_selected}
                          onChange={() => onChangeAnswer(index)}
                          id={answer.id}
                        />
                      )}
                      <label
                        htmlFor={answer.id}
                        className="break-words"
                        dangerouslySetInnerHTML={{
                          __html: answer.answer_html,
                        }}
                      ></label>
                    </div>
                  ))}
                </fieldset>
                <div className="mt-3 flex w-full justify-between">
                  <div className="flex gap-2">
                    {questionNumber > 1 && (
                      <Link
                        to={`/tests/${testId}/attempt/${attemptId}/question/${
                          +questionNumber - 1
                        }`}
                      >
                        <Button>
                          <MdNavigateBefore size={20} />
                          Previous
                        </Button>
                      </Link>
                    )}
                    {questionNumber < allQuestions.length && (
                      <Link
                        to={`/tests/${testId}/attempt/${attemptId}/question/${
                          +questionNumber + 1
                        }`}
                      >
                        <Button>
                          Next
                          <MdNavigateNext size={20} />
                        </Button>
                      </Link>
                    )}
                  </div>
                  <Button
                    onClick={() =>
                      markQuestionAsAnswered(!question.marked_as_answered)
                    }
                    color={question.marked_as_answered ? "yellow" : "green"}
                  >
                    {question.marked_as_answered ? "Unmark" : "Mark"} as
                    Answered
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <ConfirmationModal
        showModal={showConfirmModal}
        setShowModal={setShowConfirmModal}
        confirmText={"Finish"}
        rejectText={"Cancel"}
        prompt={"Are you sure you want to finish this attempt?"}
        onClick={finishAttempt}
      />
    </>
  );
};

export default Attempt;
