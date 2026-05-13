/////////////////////////////////////////////////////////////////////
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
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-2xl font-bold">Loading...</h2>
      </div>
    );

  // ================= ERROR =================

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-red-500 text-2xl">{error}</h2>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          سجل الطلبات المركزي
        </h1>

        <p className="text-gray-500 mt-2">تتبع حي للطلبات والمغاسل والعملاء</p>
      </div>

      {/* ================= FILTERS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-5 rounded-3xl border shadow-sm mb-6">
        {/* SEARCH */}

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="ابحث باسم العميل أو رقم الطلب"
          className="border rounded-2xl p-3 outline-none focus:ring-2 focus:ring-black"
        />

        {/* SERVICE FILTER */}

        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="border rounded-2xl p-3"
        >
          <option value="All">كل الخدمات</option>

          <option value="Pants">Pants</option>

          <option value="Blouse">Blouse</option>

          <option value="Shorts">Shorts</option>

          <option value="Skirt">Skirt</option>

          <option value="T-Shirt">T-Shirt</option>
        </select>

        {/* TOTAL */}

        <div className="bg-black text-white rounded-2xl flex items-center justify-center font-bold text-lg">
          {filteredOrders.length} طلب
        </div>
      </div>

      {/* ================= STATUS BUTTONS ================= */}

      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          variant={statusFilter === "All" ? "default" : "outline"}
          onClick={() => setStatusFilter("All")}
          className="rounded-xl"
        >
          كافة الطلبات
        </Button>

        <Button
          variant={statusFilter === "Pending" ? "default" : "outline"}
          onClick={() => setStatusFilter("Pending")}
          className="rounded-xl"
        >
          طلبات جديدة
        </Button>

        <Button
          variant={statusFilter === "Processing" ? "default" : "outline"}
          onClick={() => setStatusFilter("Processing")}
          className="rounded-xl"
        >
          قيد التنفيذ
        </Button>

        <Button
          variant={statusFilter === "Completed" ? "default" : "outline"}
          onClick={() => setStatusFilter("Completed")}
          className="rounded-xl"
        >
          المنتهية
        </Button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto rounded-3xl border bg-white shadow-sm">
        <table className="w-full">
          {/* ================= HEAD ================= */}

          <thead className="bg-gray-100">
            <tr className="text-gray-700">
              <th className="p-3 text-right">رقم الطلب</th>

              <th className="p-4  text-right">العميل</th>

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
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* ORDER ID */}

                  <td className="p-3 font-bold text-gray-800">
                    #{item.OrderID}
                  </td>

                  {/* CUSTOMER */}

                  <td className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <User size={18} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {item.CustomerName || "Unknown"}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Phone size={14} />

                          <span>{item.CustomerPhone || "-----"}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* SERVICES */}

                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {item.items?.map((service) => (
                        <div
                          key={service.OrderItemID}
                          className="bg-gray-100 px-3 py-1 rounded-xl text-sm"
                        >
                          {service.ServiceName} × {service.Quantity}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* TOTAL */}

                  <td className="p-4 font-bold text-green-600">
                    {item.TotalAmount} EGP
                  </td>

                  {/* ORDER STATUS */}

                  <td className="p-4">
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

                  <td className="p-4">
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

                  <td className="p-4">
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
                <td colSpan="7" className="text-center p-8 text-gray-500">
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
