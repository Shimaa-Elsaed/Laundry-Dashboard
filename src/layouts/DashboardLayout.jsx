/*
import React from "react";

import Navbar from "@/components/Navbar";
import Sidebars from "@/components/Sidebars";

import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="bg-gray-100 min-h-screen dark:bg-zinc-900">
      <Sidebars />

      <Navbar />

      <div className="ml-64 pt-20 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
*/ import React, { useState } from "react";

import Navbar from "@/components/Navbar";
import Sidebars from "@/components/Sidebars";

import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900">
      {/* SIDEBAR */}
      <Sidebars open={open} setOpen={setOpen} />

      {/* NAVBAR */}
      <Navbar open={open} setOpen={setOpen} />

      {/* CONTENT */}
      <main
        className={`
          pt-20
          transition-all
          duration-300

          ${open ? "lg:ml-64" : "lg:ml-20"}

          ml-0
        `}
      >
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
