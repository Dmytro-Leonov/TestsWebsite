import ThemeSwitch from "./ui/ThemeSwitch";
import { Link, useNavigate } from "react-router-dom";
import GoogleLoginButton from "./ui/GoogleLoginButton";
import { Dropdown } from "flowbite-react";

import { useSelector } from "react-redux";
import {
  selectId,
  selectFullName,
  selectEmail,
} from "../store/reducers/userSlice";
import useUserApi from "../api/userApi";
import trim from "../utils/trim";

import { HiLogout, HiUser } from "react-icons/hi";

const Header = () => {
  const id = useSelector(selectId);
  const fullName = trim(useSelector(selectFullName));
  const email = useSelector(selectEmail);
  const userApi = useUserApi();
  const navigate = useNavigate();

  const logout = async () => {
    await userApi.logout();
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="shadow">
      <div className="mx-auto flex w-full max-w-screen-xl justify-between p-4">
        <ul className="flex items-center gap-5">
          <li>
            <Link
              to="/"
              className="py-2 text-xl font-semibold uppercase transition-colors hover:text-gray-700 dark:hover:text-white"
            >
              That1Tests
            </Link>
          </li>
          {id && (
            <>
              <li>
                <Link
                  to="/tests"
                  className="text-md py-2 font-medium uppercase transition-colors hover:text-gray-700 dark:hover:text-white"
                >
                  Tests
                </Link>
              </li>
              <li>
                <Link
                  to="/groups"
                  className="text-md py-2 font-medium uppercase transition-colors hover:text-gray-700 dark:hover:text-white"
                >
                  Groups
                </Link>
              </li>
            </>
          )}
        </ul>
        <div className="flex items-center gap-5">
          <ThemeSwitch />
          {id ? (
            <Dropdown label={fullName} size="xs" className="py-1">
              <Dropdown.Header>
                <span className="block text-sm">{(fullName)}</span>
                <span className="block truncate text-sm font-medium">
                  {email}
                </span>
              </Dropdown.Header>
              <Link to="/profile">
                <Dropdown.Item icon={HiUser}>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <button onClick={() => logout()} className="w-full">
                <Dropdown.Item icon={HiLogout}>Sign out</Dropdown.Item>
              </button>
            </Dropdown>
          ) : (
            <GoogleLoginButton />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
