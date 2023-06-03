import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useQuestionsApi from "../../api/questionsApi";
import prepareHTML from "../../utils/prepareHTML";
import { toast } from "react-toastify";

import { Spinner } from "flowbite-react";
import QuestionForm from "../../components/forms/QuestionForm";

const EditQuestion = () => {
  const { id, questionId } = useParams();
  const navigate = useNavigate();
  const questionsApi = useQuestionsApi();

  const [isLoading, setIsLoading] = useState(true);

  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);

  const [updatedQuestion, setUpdatedQuestion] = useState({});
  const [updatedAnswers, setUpdatedAnswers] = useState([]);

  useEffect(() => {
    const getQuestion = async () => {
      setIsLoading(true);
      const response = await questionsApi.getQuestion(questionId);
      setQuestion(response);
      setAnswers(response.answers);
      setIsLoading(false);
    };
    getQuestion();
  }, []);

  const prepareAnswers = () => {
    const answers = updatedAnswers.map((answer, index) => ({
      answer: prepareHTML(answer.answer),
      order: index + 1,
      is_correct: answer.is_correct,
    }));
    return answers;
  };

  const prepareQuestion = () => {
    return {
      question_pool: id,
      question: prepareHTML(updatedQuestion.question),
      type: updatedQuestion.type,
    };
  };

  const handleSubmit = async () => {
    try {
      const answers = prepareAnswers();
      const question = prepareQuestion();
      await questionsApi.updateQuestion(questionId, {
        ...question,
        answers: answers,
      });
      toast.success("Question updated");
      navigate(`/question-pools/${id}`);
    } catch (error) {
      const fields = error.response.data.extra.fields;
      let errorMessages = [];
      const questoinErrors = fields?.question;
      const answerErrors = fields?.answers;
      const non_field_errors = fields?.non_field_errors;
      const __all__ = fields?.__all__;
      if (questoinErrors) {
        errorMessages = [...errorMessages, `Question - ${questoinErrors}`];
      }
      if (non_field_errors) {
        errorMessages = [...errorMessages, ...non_field_errors];
      }
      if (__all__) {
        errorMessages = [...errorMessages, ...__all__];
      }
      if (answerErrors) {
        Object.keys(answerErrors).forEach((answerErrorIndex) => {
          const answerError = answerErrors[answerErrorIndex];
          errorMessages = [
            ...errorMessages,
            `Answer ${+answerErrorIndex + 1} - ${answerError.answer}`,
          ];
        });
      }
      console.log(errorMessages.join("\n"));
      toast.error(<div>{errorMessages.map((m) => (<>{m}<br/></>))}</div>, {
        className: "w-[320px]",});
    }
  };


  return (
    <>
      {isLoading ? (
        <div className="w-full grid place-items-center">
          <Spinner size={"xl"} />
        </div>
      ) : (
        <div className="w-full">
          <h1 className="mb-3">Edit Question:</h1>
          <QuestionForm
            existingQuestion={question}
            existingAnswers={answers}
            setQuestion={setUpdatedQuestion}
            setAnswers={setUpdatedAnswers}
            onSubmit={handleSubmit}
            submitButtonText={"Update Question"}
          />
        </div>
      )}
    </>
  );
};

export default EditQuestion;
