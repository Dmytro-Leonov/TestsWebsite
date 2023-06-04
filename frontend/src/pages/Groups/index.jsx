import { useState, useEffect, useRef } from "react";

import useGroupsApi from "../../api/groupsApi";

import parseError from "../../utils/parseError";

import { Link } from "react-router-dom";

import { toast } from "react-toastify";

import { Spinner, Tabs, Modal, Label, TextInput, Button } from "flowbite-react";

import GroupCard from "./GroupCard";

const Groups = () => {
  const groupsAPI = useGroupsApi();

  const [createdGroups, setCreatedGroups] = useState([]);
  const [isLoadingCreatedGroups, setIsLoadingCreatedGroups] = useState(true);

  const [groupsAsAMember, setGroupsAsAMember] = useState([]);
  const [isLoadingGroupsAsAMember, setIsLoadingGroupsAsAMember] =
    useState(true);

  const [showModal, setShowModal] = useState(false);

  const groupNameRef = useRef();

  const getCreatedGroups = async () => {
    const groups = await groupsAPI.listCreatedByUser();
    setCreatedGroups(groups);
    setIsLoadingCreatedGroups(false);
  };

  const getGroupsAsAMember = async () => {
    const groups = await groupsAPI.listForUserAsAMember();
    setGroupsAsAMember(groups);
    setIsLoadingGroupsAsAMember(false);
  };

  useEffect(() => {
    getCreatedGroups();
    getGroupsAsAMember();
  }, []);

  const createGroup = async () => {
    try {
      const newGroup = await groupsAPI.create(groupNameRef.current.value);
      if (newGroup) {
        toast.success("Group created");
        groupNameRef.current.value = "";
        setShowModal(false);
        getCreatedGroups();
      }
    } catch (error) {
      const { all_field_errors } = parseError(error);
      toast.error(all_field_errors[0]);
    }
  };

  return (
    <>
      <Tabs.Group aria-label="Tabs with underline" style="underline" className="w-full">
        <Tabs.Item title="Created groups" onClick>
          <Button onClick={() => setShowModal(true)}>Create new group</Button>
          <Modal
            show={showModal}
            size="md"
            popup={true}
            dismissible={false}
            onClose={() => setShowModal(false)}
          >
            <Modal.Header />
            <Modal.Body>
              <form className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8" onSubmit={(e) => {e.preventDefault(); createGroup()}}>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Create new group
                </h3>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="name" value="Group name" />
                  </div>
                  <TextInput
                    key="group"
                    id="group"
                    placeholder="My group"
                    ref={groupNameRef}
                  />
                </div>
                <div className="w-full">
                  <Button type="submit">Create group</Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
          {isLoadingCreatedGroups ? (
            <div className="grid w-full place-items-center">
              <Spinner size="xl" />
            </div>
          ) : (
            <div>
              <div></div>
              <div className="mt-5 flex flex-wrap gap-5">
                {createdGroups.map((group) => {
                  return (
                    <Link key={group.id} to={`/group/${group.id}`}>
                      <GroupCard {...group} />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </Tabs.Item>
        <Tabs.Item title="Member of groups">
          {isLoadingGroupsAsAMember ? (
            <div className="grid w-full place-items-center">
              <Spinner aria-label="Loading spinner" size="xl" />
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap gap-5">
                {groupsAsAMember.map((group) => {
                  return (
                    <Link key={group.id} to={`/group/${group.id}`}>
                      <GroupCard {...group} />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </Tabs.Item>
      </Tabs.Group>
    </>
  );
};

export default Groups;
