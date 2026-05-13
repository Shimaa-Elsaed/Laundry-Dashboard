/*import Navbar from "@/components/Navbar";
import Sidebars from "@/components/Sidebars";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex  ">
      <Sidebars />

      <div className="flex-1 felx flex-col ">
        <Navbar />
        <div className="p-4 bg-gray-100 flex">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
*/

// DashboardLayout.jsx
import React from "react";

import Navbar from "@/components/Navbar";
import Sidebars from "@/components/Sidebars";

import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="bg-gray-100 min-h-screen dark:bg-zinc-900">
      {/* SIDEBAR */}
      <Sidebars />

      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="ml-64 pt-20 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
