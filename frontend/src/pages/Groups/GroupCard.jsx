import { formatDateTime } from "../../utils/formatDateTime";
import trim from "../../utils/trim";

const GroupCard = (group) => {
  const { name, members_count, created_at } = group;
  return (
    <div className="rounded-md border border-gray-500 p-2 transition-colors hover:border-gray-700 hover:text-gray-700 dark:border-gray-400 dark:hover:border-white dark:hover:text-white">
      <p className="font-bold">{trim(name)}</p>
      <p>Members: {members_count}</p>
      {created_at ? <p>Craeted: {formatDateTime(created_at)}</p> : null}
    </div>
  );
};

export default GroupCard;
