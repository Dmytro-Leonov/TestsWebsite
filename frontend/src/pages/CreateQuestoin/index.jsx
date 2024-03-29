import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useQuestionsApi from "../../api/questionsApi";
import parseError from "../../utils/parseError";
import prepareHTML from "../../utils/prepareHTML";
import { toast } from "react-toastify";
import QuestionForm from "../../components/forms/QuestionForm";

const CreateQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const questionsApi = useQuestionsApi();

  const [newQuestion, setNewQuestion] = useState({});
  const [newAnswers, setNewAnswers] = useState([]);

  const prepareAnswers = () => {
    const answers = newAnswers.map((answer, index) => ({
      answer: prepareHTML(answer.answer),
      order: index + 1,
      is_correct: answer.is_correct,
    }));
    return answers;
  };

  const prepareQuestion = () => {
    return {
      question_pool: id,
      question: prepareHTML(newQuestion.question),
      type: newQuestion.type,
    };
  };

  const createQuestion = async () => {
    try {
      const answers = prepareAnswers();
      const question = prepareQuestion();
      const response = await questionsApi.createQuestion({
        ...question,
        answers: answers,
      });
      console.log(response);
      toast.success("Question created");
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
      toast.error(<div>{errorMessages.map((m) => (<>{m}<br/></>))}</div>, {
        className: "w-[320px]",});
    }
  };

  return (
    <div className="flex min-w-full flex-col">
      <QuestionForm
        setQuestion={setNewQuestion}
        setAnswers={setNewAnswers}
        onSubmit={createQuestion}
        submitButtonText={"Create Question"}
      />
    </div>
  );
};

export default CreateQuestion;
