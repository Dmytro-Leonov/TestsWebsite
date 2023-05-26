import { TextInput, Spinner } from "flowbite-react";

import { MdModeEdit, MdCancel } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";

import { toast } from "react-toastify";

import Divider from "../../components/ui/Divider";

import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  selectId,
  selectFullName,
  selectEmail,
  changeFullName,
  selectSubscriptinId,
} from "../../store/reducers/userSlice";

import parseError from "../../utils/parseError";
import trim from "../../utils/trim";

import useUserApi from "../../api/userApi";
import useSubscriptionsApi from "../../api/subscriptionsApi";

const Profile = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const userApi = useUserApi();
  const subscriptionsApi = useSubscriptionsApi();

  const id = useSelector(selectId);
  const fullName = useSelector(selectFullName);
  const email = useSelector(selectEmail);
  const subscriptionId = useSelector(selectSubscriptinId);

  const [isEditing, setIsEditing] = useState(false);
  const [newFullName, setNewFullName] = useState(fullName);

  const [subscription, setSubscription] = useState(null);

  const updateUser = async () => {
    try {
      await userApi.update({
        full_name: newFullName,
      });

      dispatch(changeFullName(newFullName));
      setIsEditing(false);

      toast.success("Profile updated");
    } catch (error) {
      const { all_field_errors } = parseError(error);
      toast.error(all_field_errors[0]);
    }
  };

  const getSubscription = async () => {
    try {
      const subscription = await subscriptionsApi.details(subscriptionId);
      setSubscription(subscription);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    getSubscription();
  }, [id]);

  return (
    <>
      {id && (
        <div className="w-full">
          <h1 className="mb-2 text-3xl font-bold">Personal Info</h1>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <div className="w-32">
                  <TextInput
                    value={newFullName}
                    sizing={"sm"}
                    onInput={(e) => setNewFullName(e.target.value)}
                  />
                </div>
                <button onClick={() => updateUser()} className="text-green-500">
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
                <h1 className="text-4xl">{trim(fullName)}</h1>
                <button onClick={() => setIsEditing(true)}>
                  <MdModeEdit size={20} />
                </button>
              </>
            )}
          </div>
          <h2 className="text-xl">{email}</h2>

          <Divider />
          <h1 className="mb-2 mt-4 text-3xl font-bold">Your limitations</h1>
          {subscription ? (
            <div className="grid grid-cols-2 gap-4">
              <h3 className="text-xl font-bold">Max number of question pools:</h3>
              <h2 className="text-2xl font-bold">{subscription.max_question_pools}</h2>

              <h1 className="text-xl font-bold">Max number of questions created:</h1>
              <h2 className="text-2xl font-bold">{subscription.max_questions_total}</h2>

              <h1 className="text-xl font-bold">Max number questions in a test:</h1>
              <h2 className="text-2xl font-bold">{subscription.max_questions_in_a_test}</h2>

              <h1 className="text-xl font-bold">Max number of tests created:</h1>
              <h2 className="text-2xl font-bold">{subscription.max_tests}</h2>
              
              <h1 className="text-xl font-bold">Max number of groups created:</h1>
              <h2 className="text-2xl font-bold">{subscription.max_groups}</h2>
              
              <h1 className="text-xl font-bold">Max number of users you can add to a group:</h1>
              <h2 className="text-2xl font-bold">{subscription.max_users_in_a_group}</h2>
              
              <h1 className="text-xl font-bold">Max number of answers you can add to a question:</h1>
              <h2 className="text-2xl font-bold">{subscription.max_answers_to_a_question}</h2>
              
              <h1 className="text-xl font-bold">Max number of users you can add to a group:</h1>
              <h2 className="text-2xl font-bold">{subscription.max_users_in_a_group}</h2>
            </div>
          ) : (
            <div className="grid w-full place-items-center">
              <Spinner size={"xl"} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Profile;
