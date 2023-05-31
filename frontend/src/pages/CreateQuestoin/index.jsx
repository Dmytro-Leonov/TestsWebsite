import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useQuestionsApi from "../../api/questionsApi";

import QuestionForm from "../../components/forms/QuestionForm";

const CreateQuestion = () => {
  const { id } = useParams();
  const questionsApi = useQuestionsApi();

  const [newQuestion, setNewQuestion] = useState({});
  const [newAnswers, setNewAnswers] = useState([]);

  // useEffect(() => {
  //   if (id) {
  //     const question = await questionsApi.getQuestion(id);
  //   }
  // }, []);

  console.log(newQuestion);
  console.log(newAnswers);

  return (
    <div className="flex min-w-full flex-col">
      <QuestionForm
        existingQuestion={{question: '<p><br></p><figure><img src="https://i.ytimg.com/vi/LOpO__ykxb8/hq720.jpg" height="auto" width="auto"/></figure><p><br></p>', type: "MULTIPLE_CHOICE"}}
        existingAnswers={[]}
        setQuestion={setNewQuestion}
        setAnswers={setNewAnswers}
      />
    </div>
  );
};

export default CreateQuestion;
