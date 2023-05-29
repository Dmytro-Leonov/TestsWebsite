import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useQuestionsApi from "../../api/questionsApi";
import parseError from "../../utils/parseError";
import { toast } from "react-toastify";

import { Button, Spinner, Modal, Label, TextInput } from "flowbite-react";
import QuestionPoolCard from "./questionPoolCard";

const QuestionPools = () => {
  const questionsApi = useQuestionsApi();

  const [isLoading, setIsLoading] = useState(true);
  const [questionPools, setQuestionPools] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const questionPoolNameRef = useRef();

  useEffect(() => {
    getQuestionPools();
  }, []);

  const getQuestionPools = async () => {
    setIsLoading(true);
    const res = await questionsApi.getQuestionPools();
    setQuestionPools(res);
    setIsLoading(false);
  };

  const createQuestionPool = async () => {
    try {
      const name = questionPoolNameRef.current.value;
      await questionsApi.createQuestionPool({ name: name });
      setShowModal(false);
      questionPoolNameRef.current.value = "";
      getQuestionPools();
    } catch (error) {
      const { all_field_errors } = parseError(error);
      toast.error(all_field_errors[0]);
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <h1 className="text-4xl font-semibold">Question Pools</h1>
      <Button className=" w-max" onClick={() => setShowModal(true)}>
        Create new question pool
      </Button>
      <Modal
        show={showModal}
        size="md"
        popup={true}
        dismissible={false}
        onClose={() => setShowModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <form
            className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Create new question pool
            </h3>
            <div>
              <div className="mb-2 block">
                <Label value="Question pool name" />
              </div>
              <TextInput
                placeholder="My question pool"
                ref={questionPoolNameRef}
              />
            </div>
            <div className="w-full">
              <Button type="submit" onClick={() => createQuestionPool()}>
                Create question pool
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <div>
        {isLoading ? (
          <div className="text-center">
            <Spinner size={"xl"} />
          </div>
        ) : questionPools.length !== 0 ? (
          <div className="flex gap-3">
            {questionPools.map((questionPool) => (
              <Link
                to={`/question-pools/${questionPool.id}`}
                key={questionPool.id}
              >
                <QuestionPoolCard
                  name={questionPool.name}
                  questions_count={questionPool.questions_count}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-xl">
            You don&apos;t have any question pools
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPools;
