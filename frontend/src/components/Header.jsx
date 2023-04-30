import ThemeSwitch from "./ui/ThemeSwitch";
// import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import GoogleLoginButton from "./ui/GoogleLoginButton";
// import { AiOutlineGoogle } from "react-icons/ai";

const Header = () => {
  return (
    <header className="shadow">
      <div className="mx-auto flex w-full max-w-screen-xl justify-between p-4">
        <ul className="flex items-center gap-5">
          <li>
            <Link
              to="/"
              className="py-2 text-xl font-semibold uppercase transition-colors hover:text-white"
            >
              That1Tests
            </Link>
          </li>
          <li>
            <Link
              to="/my-tests"
              className="text-md py-2 font-medium uppercase transition-colors hover:text-white"
            >
              About
            </Link>
          </li>
        </ul>
        <div className="flex items-center gap-5">
          <ThemeSwitch />
          <GoogleLoginButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
