import { Link, useParams } from "react-router-dom";
import { default as cn } from "classnames";

const QuestionCard = ({
  id,
  testId,
  attemptId,
  order,
  hasAnswer,
  markedAsAnswered,
  isCurrent = false,
  enabled = true,
}) => {
  return (
    <Link to={enabled? `/tests/${testId}/attempt/${attemptId}/question/${order}` : "#"}>
      <div
        className={cn(
          "group relative border overflow-hidden rounded p-2 transition-colors hover:border-gray-700 hover:text-gray-700  dark:hover:border-white dark:hover:text-white",
          {
            "border-gray-600 dark:border-gray-300": hasAnswer,
            "border-gray-500 dark:border-gray-400": !hasAnswer,
            "dark:!border-white dark:text-white border-gray-700": isCurrent || markedAsAnswered,
            "!border-2": isCurrent,
          }
        )}
      >
        {order}
        <div
          className={cn(
            "absolute bottom-[-100%] left-0 right-0 h-1 transition-all group-hover:bottom-0 group-hover:bg-gray-700 group-hover:dark:bg-white",
            {
              "!bottom-0": markedAsAnswered || hasAnswer,
              "bg-gray-600 dark:bg-gray-300": hasAnswer,
              "bg-gray-500 dark:bg-gray-400": !hasAnswer,
              "dark:bg-white bg-gray-700": isCurrent || markedAsAnswered,
            }
          )}
        />
      </div>
    </Link>
  );
};

export default QuestionCard;
