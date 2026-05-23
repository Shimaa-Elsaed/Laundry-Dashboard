import React, { useEffect, useMemo, useState } from "react";
import API from "@/api/axios";

import { Search, Users, Download, ShieldCheck, User, Star } from "lucide-react";

import { MdOutlineBrowserUpdated } from "react-icons/md";

const Customers = () => {
  // ================= STATES =================

  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("All");

  // ================= FETCH USERS =================

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      setError("");

      const res = await API.get("/admin/users?role=Customer&limit=50&offset=0");

      setCustomers(res.data.data || []);
    } catch (err) {
      console.log(err);

      setError("فشل تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ================= EXPORT =================

  const handleExport = () => {
    const csvContent = [
      [
        "ID",
        "الاسم",
        "البريد",
        "رقم الجوال",
        "الرتبة",
        "النقاط",
        "الحالة",
        "تاريخ الانضمام",
      ],
      ...filteredCustomers.map((item) => [
        item.UserID,
        item.FullName,
        item.Email,
        item.PhoneNumber,
        item.Role,
        item.Points,
        item.IsActive ? "نشط" : "غير نشط",
        item.CreatedAt,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", "customers.csv");

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // ================= FILTER =================

  const filteredCustomers = useMemo(() => {
    return customers.filter((item) => {
      const matchSearch =
        item.FullName?.toLowerCase().includes(search.toLowerCase()) ||
        item.Email?.toLowerCase().includes(search.toLowerCase()) ||
        item.PhoneNumber?.includes(search);

      const matchRole = roleFilter === "All" ? true : item.Role === roleFilter;

      return matchSearch && matchRole;
    });
  }, [customers, search, roleFilter]);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f6f8fc] dark:bg-[#0f172a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

          <p className="font-bold text-lg dark:text-white">
            جاري تحميل المستخدمين...
          </p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f6f8fc] dark:bg-[#0f172a]">
        <div className="bg-white dark:bg-[#1e293b] p-10 rounded-3xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-3">حدث خطأ</h2>

          <p className="dark:text-white mb-5">{error}</p>

          <button
            onClick={fetchCustomers}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        bg-[#f6f8fc]
        dark:bg-[#0f172a]
        p-4 md:p-8
        transition-all
      "
    >
      {/* ================= HEADER ================= */}

      <div
        className="
          bg-white
          dark:bg-[#111827]
          rounded-[35px]
          p-6 md:p-8
          shadow-sm
          border
          border-gray-100
          dark:border-[#1f2937]
          mb-8
        "
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* RIGHT */}
          <div className="flex items-center gap-5">
            <div
              className="
                w-20
                h-20
                rounded-[28px]
                bg-gradient-to-br
                from-blue-600
                to-indigo-700
                flex
                items-center
                justify-center
                shadow-lg
              "
            >
              <Users className="text-white" size={38} />
            </div>

            <div>
              <h1 className="text-3xl md:text-5xl font-black dark:text-white mb-2">
                المستخدمين
              </h1>

              <p className="text-gray-500 dark:text-gray-400 text-lg">
                إدارة كافة المستخدمين المسجلين داخل المنصة
              </p>
            </div>
          </div>

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="
                h-14
                px-6
                rounded-2xl
                bg-blue-600
                hover:bg-blue-700
                text-white
                flex
                items-center
                gap-3
                font-bold
                shadow-lg
                transition-all
              "
            >
              <Download size={20} />
              تصدير
            </button>
          </div>
        </div>
      </div>

      {/* ================= FILTERS ================= */}

      <div
        className="
          bg-white
          dark:bg-[#111827]
          rounded-[30px]
          p-5
          md:p-6
          shadow-sm
          border
          border-gray-100
          dark:border-[#1f2937]
          mb-8
        "
      >
        <div className="grid lg:grid-cols-3 gap-5">
          {/* SEARCH */}
          <div className="lg:col-span-2 relative">
            <Search
              className="
                absolute
                top-1/2
                -translate-y-1/2
                right-4
                text-gray-400
              "
              size={20}
            />

            <input
              type="text"
              placeholder="ابحث بالاسم / البريد / رقم الجوال..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                h-14
                rounded-2xl
                pr-12
                px-4
                outline-none
                bg-[#f8fafc]
                dark:bg-[#0f172a]
                border
                border-gray-200
                dark:border-[#334155]
                dark:text-white
              "
            />
          </div>

          {/* FILTER */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="
              h-14
              rounded-2xl
              px-4
              outline-none
              bg-[#f8fafc]
              dark:bg-[#0f172a]
              border
              border-gray-200
              dark:border-[#334155]
              dark:text-white
              font-bold
            "
          >
            <option value="All">كل الرتب</option>

            <option value="Customer">Customer</option>

            <option value="Admin">Admin</option>

            <option value="Partner">Partner</option>
          </select>
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div
        className="
          overflow-x-auto
          bg-white
          dark:bg-[#111827]
          rounded-[35px]
          shadow-sm
          border
          border-gray-100
          dark:border-[#1f2937]
        "
      >
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr
              className="
                border-b
                border-gray-200
                dark:border-[#1f2937]
                bg-[#f8fafc]
                dark:bg-[#0b1220]
              "
            >
              <th className="p-5 text-right dark:text-white">العميل</th>

              <th className="p-5 text-right dark:text-white">رقم الجوال</th>

              <th className="p-5 text-center dark:text-white">الرتبة</th>

              <th className="p-5 text-center dark:text-white">النقاط</th>

              <th className="p-5 text-center dark:text-white">الحالة</th>

              <th className="p-5 text-center dark:text-white">
                تاريخ الانضمام
              </th>

              <th className="p-5 text-center dark:text-white">التفاصيل</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((item) => (
                <tr
                  key={item.UserID}
                  className="
                    border-b
                    border-gray-100
                    dark:border-[#1f2937]
                    hover:bg-[#f8fbff]
                    dark:hover:bg-[#0f172a]
                    transition-all
                  "
                >
                  {/* USER */}
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          w-14
                          h-14
                          rounded-2xl
                          bg-blue-100
                          dark:bg-blue-950
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <User className="text-blue-600" size={24} />
                      </div>

                      <div>
                        <h2 className="font-black text-lg dark:text-white">
                          {item.FullName || "غير معروف"}
                        </h2>

                        <p className="text-sm text-gray-500">
                          {item.Email || "لا يوجد بريد"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* PHONE */}
                  <td className="p-5 font-semibold dark:text-white">
                    {item.PhoneNumber || "-"}
                  </td>

                  {/* ROLE */}
                  <td className="p-5 text-center">
                    <div
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-bold
                        ${
                          item.Role === "Admin"
                            ? "bg-red-100 text-red-700"
                            : item.Role === "Partner"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }
                      `}
                    >
                      <ShieldCheck size={16} />

                      {item.Role}
                    </div>
                  </td>

                  {/* POINTS */}
                  <td className="p-5 text-center">
                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-full
                        bg-amber-100
                        text-amber-700
                        font-bold
                      "
                    >
                      <Star size={15} />

                      {item.Points}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="p-5 text-center">
                    <span
                      className={`
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-bold
                        ${
                          item.IsActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {item.IsActive ? "نشط" : "موقوف"}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="p-5 text-center font-semibold dark:text-white">
                    {item.CreatedAt?.split(" ")[0]}
                  </td>

                  {/* ACTION */}
                  <td className="p-5">
                    <div className="flex items-center justify-center">
                      <button
                        className="
                          w-11
                          h-11
                          rounded-xl
                          bg-blue-100
                          hover:bg-blue-200
                          text-blue-700
                          flex
                          items-center
                          justify-center
                          transition-all
                        "
                      >
                        <MdOutlineBrowserUpdated size={22} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="
                    text-center
                    py-20
                    text-gray-500
                    dark:text-gray-400
                    text-xl
                    font-bold
                  "
                >
                  لا يوجد مستخدمين
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
