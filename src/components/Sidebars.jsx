import React from "react";
import { FaHome } from "react-icons/fa";

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

import {
  ShoppingBag,
  Users,
  Shirt,
  MapPin,
  Percent,
  Megaphone,
  DollarSign,
  Layers3,
} from "lucide-react";
import { GrHostMaintenance } from "react-icons/gr";

const items = [
  {
    title: "لوحه التحكم",
    icon: <LuLayoutDashboard />,
    url: "/dashboard",
  },

  {
    title: "الطلبات",
    icon: <CiUser />,
    url: "/dashboard/orders",
  },

  {
    title: "الشكاوي",
    icon: <IoBarChart />,
    url: "/dashboard/compliments",
  },
  {
    title: "التقارير",
    icon: <FaCheckSquare />,
    url: "/dashboard/reports",
  },
  {
    title: "الكوبونات",
    icon: <Percent />,
    url: "/dashboard/copoun",
  },
  {
    title: "الاعلانات",
    icon: <Megaphone />,
    url: "/dashboard/laundry",
  },
  {
    title: "مغاسل",
    icon: <Shirt />,
    url: "/dashboard/earnings",
  },

  {
    title: "نصنيفات",
    icon: <Layers3 />,
    url: "/dashboard/ranking",
  },

  {
    title: "قاءمه الاسعار",
    icon: <DollarSign />,
    url: "/dashboard/price",
  },
  {
    title: "العملاء",
    icon: <Users />,
    url: "/dashboard/customers",
  },

  {
    title: "زيارات الترزي",
    icon: <ShoppingBag />,
    url: "/dashboard/visit",
  },

  {
    title: "طلبات الصيانه",
    icon: <GrHostMaintenance />,
    url: "/dashboard/maintence",
  },
  {
    title: "المناطق",
    icon: <MapPin />,
    url: "/dashboard/areas",
  },

  {
    title: "الاعدادات",
    icon: <IoIosSettings />,
    url: "/dashboard/settings",
  },
];

const Sidebars = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <>
      {/* OVERLAY MOBILE */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            bg-black/50
            z-40
            lg:hidden
          "
        />
      )}

      {/* SIDEBAR */}
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

          flex
          flex-col

          ${open ? "w-64" : "w-20"}

          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div
          className="
            h-16
            border-b
            border-zinc-800

            flex
            items-center
            justify-between

            px-4
          "
        >
          {open && (
            <div className="flex items-center">
              <h1>
                <FaHome className="text-blue-600" />
              </h1>
              <h1 className="  p-3 font-semibold text-xl ">Daily Laundry</h1>
            </div>
          )}
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
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                end
                className={({ isActive }) =>
                  `
                    flex
                    items-center

                    ${open ? "justify-start" : "justify-center"}

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

                {open && (
                  <span className="text-sm font-medium">{item.title}</span>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-3 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className={`
    w-full

    flex
    items-center

    ${open ? "justify-start" : "justify-center"}

    gap-3
    p-3

    rounded-xl

    hover:bg-red-500/20
    hover:text-red-400

    transition-all
  `}
          >
            <CiLogout className="text-2xl" />

            {open && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebars;
