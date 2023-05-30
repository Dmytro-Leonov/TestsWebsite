import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useQuestionsApi from "../../api/questionsApi";

import QuestionForm from "../../components/forms/QuestionForm";

const CreateQuestion = () => {
  const { id } = useParams();
  const questionsApi = useQuestionsApi();
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);

  // useEffect(() => {
  //   if (id) {
  //     const question = await questionsApi.getQuestion(id);
  //   }
  // }, []);

  return (
    <div className="flex w-full justify-center">
      <QuestionForm />
    </div>
  );
};

export default CreateQuestion;
