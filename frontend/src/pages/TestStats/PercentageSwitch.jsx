import { TbPercentage } from "react-icons/tb";
import { MdNumbers } from "react-icons/md";

const PercentageSwitch = ({ showPercentages, setShowPercentages }) => {
  return (
    <button
      className="absolute right-1 top-1 cursor-pointer rounded-full p-[2px] text-white bg-gray-500 dark:bg-gray-400 dark:text-gray-700"
      onClick={() => setShowPercentages(!showPercentages)}
    >
      {showPercentages ? (
        <MdNumbers size={18} />
      ) : (
        <TbPercentage size={18} />
      )}
    </button>
  );
};

export default PercentageSwitch;
