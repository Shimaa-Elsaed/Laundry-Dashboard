// Navbar.jsx

import { useTheme } from "next-themes";
import React from "react";

import { FaMoon } from "react-icons/fa";
import { MdLightMode } from "react-icons/md";

import { Button } from "./ui/button";

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="
        h-16
        bg-white dark:bg-zinc-950
        border-b
        border-gray-200 dark:border-zinc-800
        fixed
        top-0
        right-0
        left-[16rem]
        z-50
        flex
        items-center
        justify-between
        px-8
      "
    >
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">
        {/* DARK MODE BUTTON */}
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          variant="outline"
          className="rounded-full"
        >
          {theme === "dark" ? <MdLightMode /> : <FaMoon />}
        </Button>

        {/* USER */}
        <img
          src="https://i.pravatar.cc/40"
          alt=""
          className="w-10 h-10 rounded-full"
        />

        <div>
          <h2 className="font-semibold dark:text-white">Admin</h2>

          <p className="text-sm text-gray-500">admin@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
