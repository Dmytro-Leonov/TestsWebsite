import { HiOutlineUserRemove } from "react-icons/hi";

import { toast } from "react-toastify";
import useGroupsApi from "../../api/groupsApi";

const PersonCard = ({ member_id, full_name, group_id, is_owner, getGroup }) => {
  const groupsApi = useGroupsApi();

  const removeMember = async () => {
    try {
      await groupsApi.removeMember(group_id, member_id);
      toast.success("Member removed");
      getGroup();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex items-center gap-2 rounded border p-3">
      <h3>{full_name}</h3>
      {is_owner && (
        <button onClick={() => removeMember()}>
          <HiOutlineUserRemove className="text-red-500"/>
        </button>
      )}
    </div>
  );
};

export default PersonCard;
