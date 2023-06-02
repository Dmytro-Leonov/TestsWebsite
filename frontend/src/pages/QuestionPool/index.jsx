import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useQuestionsApi from "../../api/questionsApi";
import { toast } from "react-toastify";
import parseError from "../../utils/parseError";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Button, Spinner, TextInput } from "flowbite-react";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { MdModeEdit, MdCancel } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";
import { MdDragIndicator } from "react-icons/md";

const QuestionPool = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const questinsApi = useQuestionsApi();

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newQuestionPoolName, setNewQuestionPoolName] = useState("");
  const [questionPool, setQuestionPool] = useState();
  const [questions, setQuestions] = useState([]);

  const [showDeleteQuestionPoolModal, setDeleteQuestionPoolModal] =
    useState(false);
  const [showDeleteQuestionModal, setDeleteQuestionModal] = useState(false);
  const [questionId, setQuestionId] = useState(0);

  useEffect(() => {
    getQuestionPool();
  }, [id]);

  const getQuestionPool = async () => {
    setIsLoading(true);
    const res = await questinsApi.getQuestionPool(id);
    setQuestionPool({ name: res.name, id: res.id });
    setQuestions(res.questions);
    setNewQuestionPoolName(res.name);
    setIsLoading(false);
  };

  const deleteQuestionPool = async () => {
    try {
      await questinsApi.deleteQuestionPool(id);
      toast.success("Question pool deleted");
      navigate("/question-pools");
    } catch (error) {
      const { all_field_errors } = parseError(error);
      toast.error(all_field_errors[0]);
    }
  };

  const deleteQuestion = async () => {
    try {
      await questinsApi.deleteQuestion(questionId);
      toast.success("Question deleted");
      setDeleteQuestionModal(false);
      getQuestionPool();
    } catch (error) {
      const { all_field_errors } = parseError(error);
      toast.error(all_field_errors[0]);
    }
  };

  const questinoPoolUpdate = async () => {
    try {
      const { name } = await questinsApi.updateQuestionPool(questionPool.id, {
        name: newQuestionPoolName,
      });
      setIsEditing(false);
      setQuestionPool({ ...questionPool, name });
      toast.success("Question pool name updated");
    } catch (error) {
      const { all_field_errors } = parseError(error);
      toast.error(all_field_errors[0]);
    }
  };

  const handleOnDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newQuestions = [...questions];
    const [removed] = newQuestions.splice(source.index, 1);
    newQuestions.splice(destination.index, 0, removed);
    setQuestions(newQuestions);

    try {
      await questinsApi.updateQuestionOrder(draggableId, destination.index + 1);
    } catch (error) {
      const { all_field_errors } = parseError(error);
      toast.error(all_field_errors[0]);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="grid w-full place-items-center">
          <Spinner aria-label="Loading spinner" size="xl" />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <div className=" w-32">
                    <TextInput
                      value={newQuestionPoolName}
                      sizing={"sm"}
                      onInput={(e) => setNewQuestionPoolName(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => questinoPoolUpdate()}
                    className="text-green-500"
                  >
                    <AiOutlineCheck size={16} />
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-red-500"
                  >
                    <MdCancel size={16} />
                  </button>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-semibold">
                    {questionPool.name}
                  </h1>
                  <button onClick={() => setIsEditing(true)}>
                    <MdModeEdit size={16} />
                  </button>
                </>
              )}
            </div>
            <div>
              <Button
                onClick={() => setDeleteQuestionPoolModal(true)}
                size="xs"
                color="red"
              >
                Delete
              </Button>
            </div>
          </div>
          <div className="grow">
            {questions.length > 0 ? (
              <div className="flex flex-col gap-3">
                <Button
                  size="xs"
                  className="w-max"
                  onClick={() => navigate("add-question")}
                >
                  Add question
                </Button>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="questions">
                    {(provided) => (
                      <div
                        className="flex flex-col gap-3"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {questions.map((question, index) => (
                          <Draggable
                            key={question.id}
                            draggableId={`${question.id}`}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="flex grow gap-2"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <div className="grid w-full grid-cols-[min-content_min-content_min-content_auto_min-content_min-content] gap-2 rounded-md border border-gray-500 p-2 hover:border-gray-700 hover:text-gray-700 dark:border-gray-400 dark:hover:border-white dark:hover:text-white [&>*]:flex [&>*]:items-center">
                                  <div {...provided.dragHandleProps}>
                                    <MdDragIndicator size={18} />
                                  </div>
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
                                  <div className="hover:bg-wite h-full w-[1px] rounded bg-gray-500 hover:bg-gray-700 dark:bg-gray-400 dark:hover:bg-white"></div>

                                  <div className="flex flex-col justify-center gap-2">
                                    <Link
                                      to={`edit-question/${question.id}`}
                                      className="w-full"
                                    >
                                      <Button size="xs" className="w-full">
                                        Edit
                                      </Button>
                                    </Link>
                                    <Button
                                      size={"xs"}
                                      className="w-full"
                                      color={"red"}
                                      onClick={() => {
                                        setDeleteQuestionModal(true);
                                        setQuestionId(question.id);
                                      }}
                                    >
                                      Delete
                                    </Button>
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
            ) : (
              <div className="flex h-full items-center justify-center">
                <h1 className="text-lg font-semibold">
                  Question pool is empty
                </h1>
              </div>
            )}
          </div>
        </div>
      )}
      <ConfirmationModal
        prompt="Are you sure you want to delete this question pool?"
        confirmText="Delete"
        rejectText="Cancel"
        onClick={() => deleteQuestionPool()}
        showModal={showDeleteQuestionPoolModal}
        setShowModal={setDeleteQuestionPoolModal}
      />
      <ConfirmationModal
        prompt="Are you sure you want to delete this question?"
        confirmText="Delete"
        rejectText="Cancel"
        onClick={() => deleteQuestion()}
        showModal={showDeleteQuestionModal}
        setShowModal={setDeleteQuestionModal}
      />
    </>
  );
};

export default QuestionPool;
