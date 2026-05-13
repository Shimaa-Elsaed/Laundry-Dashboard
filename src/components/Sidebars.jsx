// Sidebars.jsx
import React from "react";

import { useState } from "react";

import { IoIosSettings } from "react-icons/io";
import { CiBellOff } from "react-icons/ci";
import { FaCalendar } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { FaMessage } from "react-icons/fa6";
import { IoBarChart } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { CiUser } from "react-icons/ci";
import { FaCheckSquare } from "react-icons/fa";
import { CiMenuBurger } from "react-icons/ci";

import { NavLink, useNavigate } from "react-router-dom";

const items = [
  {
    title: "Mangments",
    icon: <LuLayoutDashboard />,
    url: "/dashboard",
  },

  {
    title: "Orders",
    icon: <CiUser />,
    url: "/dashboard/orders",
  },

  {
    title: "Compliments",
    icon: <IoBarChart />,
    url: "/dashboard/compliments",
  },

  {
    title: "Earnings",
    icon: <FaMessage />,
    url: "/dashboard/earnings",
  },

  {
    title: "Reports",
    icon: <FaCheckSquare />,
    url: "/dashboard/reports",
  },

  {
    title: "Copoun",
    icon: <FaCalendar />,
    url: "/dashboard/copoun",
  },

  {
    title: "Ranking",
    icon: <CiBellOff />,
    url: "/dashboard/ranking",
  },

  {
    title: "Price",
    icon: <IoIosSettings />,
    url: "/dashboard/price",
  },

  {
    title: "Visits",
    icon: <IoIosSettings />,
    url: "/dashboard/visit",
  },

  {
    title: "Laundry",
    icon: <IoIosSettings />,
    url: "/dashboard/laundry",
  },

  {
    title: "Maintence",
    icon: <IoIosSettings />,
    url: "/dashboard/maintence",
  },

  {
    title: "Customers",
    icon: <IoIosSettings />,
    url: "/dashboard/customers",
  },

  {
    title: "Settings",
    icon: <IoIosSettings />,
    url: "/dashboard/settings",
  },
];

const Sidebars = () => {
  const [open, setOpen] = useState(true);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div
      className={`
        fixed
        left-0
        top-0
        h-screen
        bg-zinc-950
        text-white
        border-r
        border-zinc-800
        transition-all
        duration-300
        z-50
        ${open ? "w-64" : "w-20"}
      `}
    >
      {/* HEADER */}
      <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-4">
        {open && <h1 className="text-xl font-black">Admin</h1>}

        <button
          onClick={() => setOpen(!open)}
          className="
            p-2
            rounded-lg
            hover:bg-zinc-800
            transition
          "
        >
          <CiMenuBurger className="text-xl" />
        </button>
      </div>

      {/* MENU */}
      <div className="p-3 flex flex-col gap-2 overflow-y-auto h-[calc(100vh-130px)]">
        {items.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end
            className={({ isActive }) =>
              `
                flex
                items-center
                gap-3
                p-3
                rounded-xl
                transition-all
                ${
                  isActive
                    ? "bg-[#5B3DF5] text-white"
                    : "hover:bg-zinc-800 text-zinc-300"
                }
              `
            }
          >
            <span className="text-2xl">{item.icon}</span>

            {open && <span className="text-sm font-medium">{item.title}</span>}
          </NavLink>
        ))}
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 w-full p-3 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            gap-3
            p-3
            rounded-xl
            hover:bg-red-500/20
            hover:text-red-400
            transition-all
          "
        >
          <CiLogout className="text-2xl" />

          {open && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebars;
