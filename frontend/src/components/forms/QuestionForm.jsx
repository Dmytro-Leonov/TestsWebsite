import { useState } from "react";
import RichTextEditor from "./RichTextEditor";
import { Button, Checkbox, Radio, Label } from "flowbite-react";
import { MdDragIndicator } from "react-icons/md";
import Divider from "../ui/Divider";

const QuestionForm = ({ existingQuestion, existingAnswers }) => {
  const [question, setQuestion] = useState(existingQuestion);
  const [answers, setAnswers] = useState(existingAnswers);

  let defaultAnswer = {
    answer: "",
    isCorrect: false,
  };

  let newQuestion = {
    id: existingQuestion?.id,
    question: existingQuestion?.question,
    type: existingQuestion?.type,
  };

  let newAnswers = existingQuestion?.answers || [
    structuredClone(defaultAnswer),
    structuredClone(defaultAnswer),
    structuredClone(defaultAnswer),
  ];

  const updateQueestion = (markup) => {
    newQuestion.question = markup;
    console.log(newQuestion);
  };

  const updateAnswer = (markup, index) => {
    newAnswers[index].answer = markup;
    console.log(newAnswers);
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="mb-2 font-semibold">Question:</h3>
        <div className="flex flex-col gap-3">
          <RichTextEditor setMarkup={updateQueestion} />
          <fieldset className="flex max-w-md flex-col gap-4" id="radio">
            <legend className="mb-2 text-lg">Question type:</legend>
            <div className="flex items-center gap-2">
              <Radio
                defaultChecked
                id="SINGLE_CHOICE"
                name="type"
                value="SINGLE_CHOICE"
              />
              <Label htmlFor="SINGLE_CHOICE">Single Choice</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio id="MULTIPLE_CHOICE" name="type" value="MULTIPLE_CHOICE" />
              <Label htmlFor="MULTIPLE_CHOICE">Multiple choice</Label>
            </div>
          </fieldset>
        </div>
      </div>
      {
        <div>
          <h3 className="font-semibold">Answers:</h3>
          <div className="flex flex-col h-full">
            {newAnswers.map((answer, index) => {
              return (
                <div key={index} className="flex flex-col h-full">
                  <Divider />
                  <div className="flex flex-col gap-2 h-full">
                    <div className="flex gap-2 items-center h-full">
                      <MdDragIndicator size={20} />
                      <span className="bold">{index + 1}</span>
                      <div className="h-full w-[1px] rounded bg-gray-500 dark:bg-gray-400"></div>
                      <div>
                        <RichTextEditor
                          initialHTML={answer.answer}
                          setMarkup={(state) => updateAnswer(state, index)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`answer-${index}`}
                        name={`answer-${index}`}
                        value={`answer-${index}`}
                        defaultChecked={answer.isCorrect}
                      />
                      <Label htmlFor={`answer-${index}`}>Correct answer</Label>
                    </div>
                  </div>

                  <Divider />
                </div>
              );
            })}
          </div>
        </div>
      }
    </div>
  );
};

export default QuestionForm;
