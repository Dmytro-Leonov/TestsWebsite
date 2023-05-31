import { useEffect, useState } from "react";
import RichTextEditor from "./RichTextEditor";
import { Button, Checkbox, Radio, Label } from "flowbite-react";
import { MdDragIndicator } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const QuestionForm = ({
  existingQuestion,
  existingAnswers,
  setQuestion,
  setAnswers,
}) => {
  let defaultAnswer = {
    answer: "",
    is_correct: false,
  };

  // let newQuestion = {
  //   id: existingQuestion?.id,
  //   question: existingQuestion?.question || "",
  //   type: existingQuestion?.type || "SINGLE_CHOICE",
  //   state: EditorState.createWithContent(
  //     stateFromHTML(existingQuestion?.question || "")
  //   ),
  // };
  const [newQuestion, setNewQuestion] = useState({});
  const [newAnswers, setNewAnswers] = useState([]);

  useEffect(() => {
    setNewQuestion({
      id: existingQuestion?.id,
      question: existingQuestion?.question || "",
      type: existingQuestion?.type || "SINGLE_CHOICE",
      state: EditorState.createWithContent(
        stateFromHTML(existingQuestion?.question || "")
      ),
    });
    setQuestion({
      id: existingQuestion?.id,
      question: existingQuestion?.question || "",
      type: existingQuestion?.type || "SINGLE_CHOICE",
    });
    let existingAnswersCopy = structuredClone(existingAnswers);
    existingAnswersCopy.forEach((answer) => {
      answer.state = EditorState.createWithContent(
        stateFromHTML(answer.answer)
      );
    });
    existingAnswersCopy =
      existingAnswersCopy.length > 0
        ? existingAnswersCopy
        : [{ ...defaultAnswer, state: EditorState.createEmpty() }];
    setNewAnswers(existingAnswersCopy);
    setAnswers(
      existingAnswersCopy.map((answer) => ({
        id: answer.id,
        answer: answer.answer,
        is_correct: answer.is_correct,
      }))
    );
  }, []);

  const updateQueestion = (state) => {
    const newQuestionCopy = { ...newQuestion };
    newQuestionCopy.state = state;
    newQuestionCopy.question = stateToHTML(state.getCurrentContent());
    setNewQuestion(newQuestionCopy);
    setQuestion({
      id: newQuestionCopy?.id,
      question: newQuestionCopy?.question || "",
      type: newQuestionCopy?.type || "SINGLE_CHOICE",
    });
  };

  const updateAnswer = (state, index) => {
    const newAnswersCopy = [...newAnswers];
    newAnswersCopy[index].state = state;
    newAnswersCopy[index].answer = stateToHTML(state.getCurrentContent());
    setNewAnswers(newAnswersCopy);
    setAnswers(
      newAnswersCopy.map((answer) => ({
        id: answer.id,
        answer: answer.answer,
        is_correct: answer.is_correct,
      }))
    );
  };

  const addNewAnswer = () => {
    const newAnswersCopy = [...newAnswers];
    newAnswersCopy.push({ ...defaultAnswer, state: EditorState.createEmpty() });
    setNewAnswers(newAnswersCopy);
    setAnswers(
      newAnswersCopy.map((answer) => ({
        id: answer.id,
        answer: answer.answer,
        is_correct: answer.is_correct,
      }))
    );
  };

  const deleteAnswer = (index) => {
    const newAnswersCopy = [...newAnswers];
    newAnswersCopy.splice(index, 1);
    setNewAnswers(newAnswersCopy);
    setAnswers(
      newAnswersCopy.map((answer) => ({
        id: answer.id,
        answer: answer.answer,
        is_correct: answer.is_correct,
      }))
    );
  };

  const handleOnDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newAnswersCopy = newAnswers.map((answer) => {
      const state = convertFromRaw(
        JSON.parse(
          JSON.stringify(convertToRaw(answer.state.getCurrentContent()))
        )
      );
      return { ...answer, state: EditorState.createWithContent(state) };
    });
    const [removed] = newAnswersCopy.splice(source.index, 1);
    newAnswersCopy.splice(destination.index, 0, removed);

    setNewAnswers(newAnswersCopy);
    setAnswers(
      newAnswersCopy.map((answer) => ({
        id: answer.id,
        answer: answer.answer,
        is_correct: answer.is_correct,
      }))
    );
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="w-full rounded bg-slate-300 p-2 dark:bg-slate-700">
        <h3 className="mb-2 font-semibold">Question:</h3>
        <div className="flex flex-col gap-3">
          <div>
            <RichTextEditor
              initialState={newQuestion.state}
              setState={updateQueestion}
            />
          </div>
          <fieldset className="flex max-w-md flex-col gap-4" id="radio">
            <legend className="mb-2 text-lg">Question type:</legend>
            <div className="flex items-center gap-2">
              <Radio
                defaultChecked
                id="SINGLE_CHOICE"
                name="type"
                value="SINGLE_CHOICE"
                onClick={(e) => {
                  setQuestion({
                    id: newQuestion?.id,
                    question: newQuestion?.question || "",
                    type: e.target.value,
                  });
                }}
              />
              <Label htmlFor="SINGLE_CHOICE">Single Choice</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio
                id="MULTIPLE_CHOICE"
                name="type"
                value="MULTIPLE_CHOICE"
                onClick={(e) => {
                  setQuestion({
                    id: newQuestion?.id,
                    question: newQuestion?.question || "",
                    type: e.target.value,
                  });
                }}
              />
              <Label htmlFor="MULTIPLE_CHOICE">Multiple choice</Label>
            </div>
          </fieldset>
        </div>
      </div>
      {
        <div className="h-full w-full">
          <h3 className="font-semibold">Answers:</h3>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="answers">
              {(provided) => (
                <div
                  className="flex w-full flex-col gap-3"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {newAnswers.map((answer, index) => (
                    <Draggable
                      key={`answer-${index}`}
                      draggableId={`${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          key={index}
                          className="flex w-full flex-col"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <div className="flex w-full flex-col gap-2 rounded bg-slate-300 p-2 dark:bg-slate-700">
                            <div className="grid grid-cols-[min-content_min-content_min-content_auto_min-content_min-content] gap-2">
                              <div
                                className="flex items-center"
                                {...provided.dragHandleProps}
                              >
                                <MdDragIndicator size={23} />
                              </div>
                              <span className="flex items-center">
                                {index + 1}
                              </span>
                              <div className="h-full w-[1px] rounded bg-gray-100 dark:bg-gray-400"></div>
                              <div className="w-full min-w-full max-w-full">
                                <RichTextEditor
                                  initialState={answer.state}
                                  setState={(state) =>
                                    updateAnswer(state, index)
                                  }
                                />
                              </div>
                              <div className="h-full w-[1px] rounded bg-gray-100 dark:bg-gray-400"></div>
                              <button
                                className="flex items-center text-red-500"
                                onClick={() => deleteAnswer(index)}
                              >
                                <RiDeleteBin2Line size={25} />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`answer-${index}`}
                                name={`answer-${index}`}
                                value={`answer-${index}`}
                                checked={answer.is_correct}
                                onChange={(e) => {
                                  const newAnswersCopy = [...newAnswers];
                                  newAnswersCopy[index].is_correct =
                                    e.target.checked;
                                  setNewAnswers(newAnswersCopy);
                                  setAnswers(
                                    newAnswersCopy.map((answer) => ({
                                      id: answer.id,
                                      answer: answer.answer,
                                      is_correct: answer.is_correct,
                                    }))
                                  );
                                }}
                              />
                              <Label htmlFor={`answer-${index}`}>
                                Correct answer
                              </Label>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      }
      <div className="ml-auto">
        <Button onClick={addNewAnswer}>Add new answer</Button>
      </div>
    </div>
  );
};

export default QuestionForm;
