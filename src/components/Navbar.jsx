import { useTheme } from "next-themes";
import React from "react";

import { FaMoon } from "react-icons/fa";
import { MdLightMode } from "react-icons/md";
import { CiMenuBurger } from "react-icons/ci";

import { Button } from "./ui/button";

const Navbar = ({ open, setOpen }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`
        h-16
        bg-white dark:bg-zinc-950
        border-b
        border-gray-200 dark:border-zinc-800
        fixed
        top-0
        right-0
        z-40

        flex
        items-center
        justify-between

        px-4 md:px-8

        transition-all
        duration-300

        ${open ? "lg:left-64" : "lg:left-20"}

        left-0
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="
            p-2
            rounded-lg
            hover:bg-gray-100
            dark:hover:bg-zinc-800
            transition
          "
        >
          <CiMenuBurger className="text-2xl dark:text-white" />
        </button>

        <h1 className="text-xl md:text-2xl font-bold text-zinc-800 dark:text-white">
          Laundry
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* DARK MODE */}
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          variant="outline"
          className="rounded-full"
        >
          {theme === "dark" ? <MdLightMode /> : <FaMoon />}
        </Button>

        {/* USER INFO */}
        <div className="hidden md:block">
          <h2 className="font-semibold dark:text-white">Daily Laundry</h2>

          <p className="text-sm text-gray-500">shimaa@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
