import { useParams, useNavigate } from "react-router-dom";

import { useEffect, useState, useRef } from "react";

import useGroupsApi from "../../api/groupsApi";

import { Spinner, TextInput, Button, Modal } from "flowbite-react";
import { toast } from "react-toastify";

import parseError from "../../utils/parseError";

import Divider from "../../components/ui/Divider";
import PersonCard from "./PersonCard";

const Group = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const groupsApi = useGroupsApi();

  const [isLoading, setIsLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const emailsRef = useRef();

  const getGroup = async () => {
    try {
      const group = await groupsApi.details(id);
      setGroup({ ...group, members_count: group.members.length });
      setNewGroupName(group.name);
      setIsLoading(false);
    } catch (error) {
      toast.error("Group not found");
      navigate("/groups");
    }
  };
  useEffect(() => {
    getGroup();
  }, []);

  const groupUpdate = async () => {
    try {
      const { name } = await groupsApi.update(group.id, newGroupName);
      setIsEditing(false);
      setGroup({ ...group, name });
      toast.success("Group name updated");
    } catch (error) {
      const { all_field_errors } = parseError(error);
      toast.error(all_field_errors[0]);
    }
  };

  const addMembers = async () => {
    try {
      const emails = emailsRef.current.value.trim().split("\n");
      const { message } = await groupsApi.addMembers(group.id, emails);
      toast.success(message);
      setShowModal(false);
      setIsLoading(true);
      getGroup();
    } catch (error) {
      const { all_field_errors } = parseError(error);
      toast.error(all_field_errors[0]);
    }
  };

  const leaveGroup = async () => {
    try {
      await groupsApi.leave(group.id);
      toast.success("You left the group");
      navigate("/groups");
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
        <div className="w-full">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <div className=" w-32">
                  <TextInput
                    value={newGroupName}
                    sizing={"sm"}
                    onInput={(e) => setNewGroupName(e.target.value)}
                  />
                </div>
                <Button size={"xs"} onClick={() => groupUpdate()}>
                  Save
                </Button>
                <Button
                  size={"xs"}
                  color={"red"}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-semibold">{group.name}</h1>
                <div className="flex grow justify-between">
                  {group.is_owner && (
                    <Button size={"xs"} onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  )}
                  {group.is_member && (
                    <Button
                      size={"xs"}
                      color={"red"}
                      onClick={() => leaveGroup()}
                    >
                      Leave
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
          <Divider />
          {group.is_owner && (
            <Button size={"xs"} onClick={() => setShowModal(true)}>
              Add members
            </Button>
          )}
          <Modal
            show={showModal}
            size="md"
            popup={true}
            dismissible={false}
            onClose={() => setShowModal(false)}
          >
            <Modal.Header />
            <Modal.Body>
              <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Add members to your group
                </h3>
                <label
                  htmlFor="emails"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Input emails separated by a new line
                </label>
                <textarea
                  id="emails"
                  rows="4"
                  className="block max-h-[500px] w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="example@gmail.com"
                  ref={emailsRef}
                ></textarea>
                <div className="w-full">
                  <Button onClick={() => addMembers()}>Add members</Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          <div className="mt-2 flex gap-5">
            {group.members.map((member) => {
              return (
                <PersonCard
                  key={member.id}
                  full_name={member.full_name}
                  member_id={member.id}
                  group_id={group.id}
                  is_owner={group.is_owner}
                  getGroup={getGroup}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Group;
