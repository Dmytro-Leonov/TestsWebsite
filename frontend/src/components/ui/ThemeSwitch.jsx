import { useState, useEffect } from "react";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";

const ThemeSwitch = () => {
  const [currentTheme, setCurrentTheme] = useState("dark");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const userMedia =
      !("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (storedTheme === "dark" || userMedia) {
      setCurrentTheme("dark");
    } else {
      setCurrentTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    const newCurrentTheme = currentTheme === "dark" ? "light" : "dark";

    setCurrentTheme(newCurrentTheme);
    window.localStorage.setItem("theme", newCurrentTheme);

    if (newCurrentTheme === "dark") {
      return document.documentElement.classList.add("dark");
    } else {
      return document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={() => toggleTheme()}
      className="rounded-md border border-gray-500 p-[7px] transition-colors hover:border-gray-700 hover:text-gray-700 dark:border-gray-400 dark:hover:border-white dark:hover:text-white"
    >
      {currentTheme === "dark" ? <BsSunFill /> : <BsMoonStarsFill />}
    </button>
  );
};

export default ThemeSwitch;
