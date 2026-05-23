import React, { useEffect, useMemo, useState } from "react";
import API from "@/api/axios";
import { Button } from "@/components/ui/button";

import { Phone, User } from "lucide-react";

const Orders = () => {
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [orders, setOrders] = useState([]);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);

  // ================= FETCH API =================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/admin/orders");

      setOrders(data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
      }

      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= FILTER DATA =================

  const filteredOrders = useMemo(() => {
    const processingStatuses = [
      "Accepted",

      "InPicking",
      "Washing",
      "Ironing",
      "Ready",
      "InDelivery",
    ];

    return orders.filter((item) => {
      // SEARCH

      const matchesSearch =
        item.OrderID.toString().includes(search) ||
        item.CustomerName?.toLowerCase().includes(search.toLowerCase());

      // SERVICE FILTER

      const matchesService =
        serviceFilter === "All"
          ? true
          : item.items?.some(
              (service) =>
                service.ServiceName?.toLowerCase() ===
                serviceFilter.toLowerCase(),
            );

      // STATUS FILTER

      let matchesStatus = true;

      if (statusFilter === "Pending") {
        matchesStatus = item.OrderStatus === "Pending";
      } else if (statusFilter === "Processing") {
        matchesStatus = processingStatuses.includes(item.OrderStatus);
      } else if (statusFilter === "Completed") {
        matchesStatus = item.OrderStatus === "Completed";
      }

      return matchesSearch && matchesService && matchesStatus;
    });
  }, [orders, search, serviceFilter, statusFilter]);

  // ================= LOADING =================

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-[#0f172a]">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Loading...
        </h2>
      </div>
    );

  // ================= ERROR =================

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-[#0f172a]">
        <h2 className="text-red-500 text-2xl">{error}</h2>
      </div>
    );

  return (
    <div
      dir="rtl"
      className="p-3 md:p-6 bg-gray-50 dark:bg-[#0f172a] min-h-screen transition-all duration-300 text-right"
    >
      {/* ================= HEADER ================= */}

      <div className="mb-6 text-right">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          سجل الطلبات المركزي
        </h1>

        <p className="text-sm md:text-base text-gray-500 dark:text-gray-300 mt-2">
          تتبع حي للطلبات والمغاسل والعملاء
        </p>
      </div>

      {/* ================= FILTERS ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-white dark:bg-[#1e293b] p-4 md:p-5 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm mb-6">
        {/* SEARCH */}

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="ابحث باسم العميل أو رقم الطلب"
          className="border border-gray-200 dark:border-slate-600 rounded-2xl p-3 outline-none bg-white dark:bg-[#0f172a] text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-black dark:focus:ring-white transition text-right"
        />

        {/* SERVICE FILTER */}

        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="border border-gray-200 dark:border-slate-600 rounded-2xl p-3 bg-white dark:bg-[#0f172a] text-gray-800 dark:text-white text-right"
        >
          <option value="All">كل الخدمات</option>

          <option value="Pants">Pants</option>

          <option value="Blouse">Blouse</option>

          <option value="Shorts">Shorts</option>

          <option value="Skirt">Skirt</option>

          <option value="T-Shirt">T-Shirt</option>
        </select>

        {/* TOTAL */}

        <div className="bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center font-bold text-lg py-3">
          {filteredOrders.length} طلب
        </div>
      </div>

      {/* ================= STATUS BUTTONS ================= */}

      <div className="flex flex-wrap gap-3 mb-6 justify-start">
        <Button
          variant={statusFilter === "All" ? "default" : "outline"}
          onClick={() => setStatusFilter("All")}
          className="rounded-xl dark:border-slate-600 dark:text-white"
        >
          كافة الطلبات
        </Button>

        <Button
          variant={statusFilter === "Pending" ? "default" : "outline"}
          onClick={() => setStatusFilter("Pending")}
          className="rounded-xl dark:border-slate-600 dark:text-white"
        >
          طلبات جديدة
        </Button>

        <Button
          variant={statusFilter === "Processing" ? "default" : "outline"}
          onClick={() => setStatusFilter("Processing")}
          className="rounded-xl dark:border-slate-600 dark:text-white"
        >
          قيد التنفيذ
        </Button>

        <Button
          variant={statusFilter === "Completed" ? "default" : "outline"}
          onClick={() => setStatusFilter("Completed")}
          className="rounded-xl dark:border-slate-600 dark:text-white"
        >
          المنتهية
        </Button>
      </div>

      {/* ================= MOBILE CARDS ================= */}

      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((item) => (
            <div
              key={item.OrderID}
              className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-3xl p-4 shadow-sm text-right"
            >
              {/* TOP */}

              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium
                  
                  ${
                    item.OrderStatus === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : item.OrderStatus === "Completed"
                        ? "bg-green-100 text-green-700"
                        : item.OrderStatus === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                  }
                `}
                >
                  {item.OrderStatus}
                </span>

                <h2 className="font-bold text-lg text-gray-800 dark:text-white">
                  #{item.OrderID}
                </h2>
              </div>

              {/* CUSTOMER */}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {item.CustomerName || "Unknown"}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300 mt-1 justify-end">
                    <span>{item.CustomerPhone || "-----"}</span>

                    <Phone size={14} />
                  </div>
                </div>

                <div className="bg-gray-100 dark:bg-slate-700 p-2 rounded-full">
                  <User size={18} className="text-gray-700 dark:text-white" />
                </div>
              </div>

              {/* SERVICES */}

              <div className="flex flex-wrap gap-2 mb-4 justify-end">
                {item.items?.map((service) => (
                  <div
                    key={service.OrderItemID}
                    className="bg-gray-100 dark:bg-slate-700 dark:text-white px-3 py-1 rounded-xl text-sm"
                  >
                    {service.ServiceName} × {service.Quantity}
                  </div>
                ))}
              </div>

              {/* INFO */}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-[#0f172a] rounded-2xl p-3 text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    المبلغ
                  </p>

                  <h3 className="font-bold text-green-600">
                    {item.TotalAmount} EGP
                  </h3>
                </div>

                <div className="bg-gray-50 dark:bg-[#0f172a] rounded-2xl p-3 text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    السرعة
                  </p>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    
                    ${
                      item.SpeedName === "سريع"
                        ? "bg-red-100 text-red-700"
                        : "bg-indigo-100 text-indigo-700"
                    }
                  `}
                  >
                    {item.SpeedName}
                  </span>
                </div>
              </div>

              {/* PARTNER STATUS */}

              <div className="mt-4 text-right">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                  
                  ${
                    item.PartnerAcceptance === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : item.PartnerAcceptance === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                  }
                `}
                >
                  {item.PartnerAcceptance}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 text-gray-500 dark:text-gray-300 bg-white dark:bg-[#1e293b] rounded-3xl">
            لا توجد طلبات
          </div>
        )}
      </div>

      {/* ================= TABLE ================= */}

      <div className="hidden lg:block overflow-x-auto rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] shadow-sm">
        <table className="w-full text-right">
          {/* ================= HEAD ================= */}

          <thead className="bg-gray-100 dark:bg-slate-800">
            <tr className="text-gray-700 dark:text-white">
              <th className="p-3 text-right">رقم الطلب</th>

              <th className="p-4 text-right">العميل</th>

              <th className="p-4 text-right">الخدمات</th>

              <th className="p-4 text-right">المبلغ</th>

              <th className="p-4 text-right">حالة الطلب</th>

              <th className="p-4 text-right">حالة المغسلة</th>

              <th className="p-4 text-right">السرعة</th>
            </tr>
          </thead>

          {/* ================= BODY ================= */}

          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((item) => (
                <tr
                  key={item.OrderID}
                  className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                >
                  {/* ORDER ID */}

                  <td className="p-3 font-bold text-gray-800 dark:text-white text-right">
                    #{item.OrderID}
                  </td>

                  {/* CUSTOMER */}

                  <td className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-right">
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {item.CustomerName || "Unknown"}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300 mt-1 justify-end">
                          <span>{item.CustomerPhone || "-----"}</span>

                          <Phone
                            size={14}
                            className="text-gray-700 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="bg-gray-100 dark:bg-slate-700 p-2 rounded-full">
                        <User
                          size={18}
                          className="text-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </td>

                  {/* SERVICES */}

                  <td className="p-4">
                    <div className="flex flex-wrap gap-2 justify-end">
                      {item.items?.map((service) => (
                        <div
                          key={service.OrderItemID}
                          className="bg-gray-100 dark:bg-slate-700 dark:text-white px-3 py-1 rounded-xl text-sm"
                        >
                          {service.ServiceName} × {service.Quantity}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* TOTAL */}

                  <td className="p-4 font-bold text-green-600 text-right">
                    {item.TotalAmount} EGP
                  </td>

                  {/* ORDER STATUS */}

                  <td className="p-4 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium
                      
                      ${
                        item.OrderStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.OrderStatus === "Completed"
                            ? "bg-green-100 text-green-700"
                            : item.OrderStatus === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                      }
                      `}
                    >
                      {item.OrderStatus}
                    </span>
                  </td>

                  {/* PARTNER STATUS */}

                  <td className="p-4 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium
                      
                      ${
                        item.PartnerAcceptance === "Accepted"
                          ? "bg-green-100 text-green-700"
                          : item.PartnerAcceptance === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }
                      `}
                    >
                      {item.PartnerAcceptance}
                    </span>
                  </td>

                  {/* SPEED */}

                  <td className="p-4 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium
                      
                      ${
                        item.SpeedName === "سريع"
                          ? "bg-red-100 text-red-700"
                          : "bg-indigo-100 text-indigo-700"
                      }
                      `}
                    >
                      {item.SpeedName}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center p-8 text-gray-500 dark:text-gray-300"
                >
                  لا توجد طلبات
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
