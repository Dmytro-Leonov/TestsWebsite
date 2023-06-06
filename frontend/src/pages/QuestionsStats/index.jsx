import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { TbPercentage } from "react-icons/tb";
import { MdNumbers } from "react-icons/md";

import Divider from "../../components/ui/Divider";

const QuestionsStats = () => {
  const { testId } = useParams();

  const [marksShowPercentages, setMarksShowPercentages] = useState(false);
  const [questionsShowPercentages, setQuestionsShowPercentages] =
    useState(false);

  // avg mark
  // min mark
  // max mark
  // max possible mark

  // avg time taken
  // min time taken
  // max time taken
  // max possible time taken

  // correctly answered questions
  // incorrectly answered questions
  // total questions

  // count of correct answers for each question
  // count of incorrect answers for each question
  // count of times each answer was selected / total answers

  return (
    <div className="w-full">
      <h1 className="font-bold">Test bla bla statistics</h1>
      <Divider />
      <div className="flex flex-wrap gap-4">
        <div className="dark:border-gray-40 relative rounded border border-gray-500 p-2">
          <button
            className="absolute right-1 top-1 cursor-pointer"
            onClick={() => setMarksShowPercentages(!marksShowPercentages)}
          >
            {marksShowPercentages ? (
              <MdNumbers size={18} />
            ) : (
              <TbPercentage size={18} />
            )}
          </button>
          <h2 className="font-bold">Mark</h2>
          <div className="grid grid-cols-[max-content_max-content_max-content_max-content] gap-x-5 text-lg">
            <span>Max Possible</span>
            <span>Min</span>
            <span>Max</span>
            <span>Avg</span>

            <span>{marksShowPercentages ? "100%" : 7}</span>
            <span>{marksShowPercentages ? "23%" : 23}</span>
            <span>{marksShowPercentages ? "97%" : 97}</span>
            <span>{marksShowPercentages ? "69%" : 69}</span>
          </div>
        </div>
        <div className="dark:border-gray-40 rounded border border-gray-500 p-2">
          <h2 className="font-bold">Time Taken</h2>
          <div className="grid grid-cols-[max-content_max-content_max-content_max-content] gap-x-5 text-lg">
            <span>Max Possible</span>
            <span>Min</span>
            <span>Max</span>
            <span>Avg</span>

            <span>00:30:00</span>
            <span>00:00:55</span>
            <span>00:29:10</span>
            <span>00:15:44</span>
          </div>
        </div>
        <div className="dark:border-gray-40 relative rounded border border-gray-500 p-2">
          <button
            className="absolute right-1 top-1 cursor-pointer"
            onClick={() => setQuestionsShowPercentages(!questionsShowPercentages)}
          >
            {questionsShowPercentages ? (
              <MdNumbers size={18} />
            ) : (
              <TbPercentage size={18} />
            )}
          </button>
          <h2 className="font-bold">Questions</h2>
          <div className="grid grid-cols-[max-content_max-content_max-content] gap-x-5 text-lg">
            <span>All answered</span>
            <span>Correct</span>
            <span>Wrong</span>

            <span>{questionsShowPercentages ? "100%" : 7}</span>
            <span>{questionsShowPercentages ? "23%" : 23}</span>
            <span>{questionsShowPercentages ? "97%" : 97}</span>

          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsStats;
