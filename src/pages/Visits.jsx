import React, { useEffect, useMemo, useState } from "react";

import API from "@/api/axios";

import { Button } from "@/components/ui/button";

import { Search, Eye, BadgeDollarSign, CalendarDays } from "lucide-react";

import { MdDelete } from "react-icons/md";

import { IoClose } from "react-icons/io5";

const Visits = () => {
  // ================= STATES =================

  const [visits, setVisits] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [serviceFilter, setServiceFilter] = useState("all");

  const [openView, setOpenView] = useState(false);

  const [selectedVisit, setSelectedVisit] = useState(null);

  // ================= GET DATA =================

  const getVisits = async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/tailor/visits");

      setVisits(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVisits();
  }, []);

  // ================= UNIQUE =================

  const services = [
    ...new Set(visits.map((item) => item.ServiceType).filter(Boolean)),
  ];

  const statuses = [
    ...new Set(
      visits
        .map((item) => (item.Status ? item.Status : "Pending"))
        .filter(Boolean),
    ),
  ];

  // ================= FILTERED =================

  const filteredData = useMemo(() => {
    return visits.filter((item) => {
      const matchSearch =
        item.CustomerName?.toLowerCase().includes(search.toLowerCase()) ||
        item.CustomerPhone?.includes(search) ||
        item.VisitID?.toString().includes(search);

      const matchStatus =
        statusFilter === "all"
          ? true
          : (item.Status || "Pending") === statusFilter;

      const matchService =
        serviceFilter === "all" ? true : item.ServiceType === serviceFilter;

      return matchSearch && matchStatus && matchService;
    });
  }, [visits, search, statusFilter, serviceFilter]);

  // ================= STATUS COLORS =================

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";

      case "Confirmed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";

      case "Processing":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";

      case "Completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";

      case "Approved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";

      case "Rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getServiceName = (service) => {
    switch (service) {
      case "NewTailoring":
        return "تفصيل جديد";

      case "Alteration":
        return "تعديل ملابس";

      default:
        return service;
    }
  };

  const handleView = (item) => {
    setSelectedVisit(item);
    setOpenView(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("هل تريد حذف الطلب ؟");

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/tailor/visits/${id}`);
      getVisits();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100">
      {/* ERROR */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-4 rounded-2xl mb-6">
          {error}
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white dark:bg-gray-900 rounded-[40px] p-6 md:p-8 mb-8 border dark:border-gray-800">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
          <Button className="rounded-2xl h-14 px-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50">
            {visits.length} طلب نشط
            <CalendarDays className="w-5 h-5 mr-2" />
          </Button>

          <div className="text-center lg:text-right">
            <h1 className="text-3xl md:text-5xl font-black">زيارات الترزي</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Tailoring Operations Hub
            </p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-[35px] border dark:border-gray-700 p-5 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="h-14 rounded-2xl border dark:border-gray-700 px-4 bg-white dark:bg-gray-900"
            >
              <option value="all">كل الخدمات</option>
              {services.map((service, index) => (
                <option key={index} value={service}>
                  {getServiceName(service)}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-14 rounded-2xl border dark:border-gray-700 px-4 bg-white dark:bg-gray-900"
            >
              <option value="all">كل الحالات</option>
              {statuses.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <div className="relative">
              <Search className="absolute right-4 top-4 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث..."
                className="w-full h-14 rounded-2xl border dark:border-gray-700 px-12 bg-white dark:bg-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-900 rounded-[35px] overflow-hidden border dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-5">العمليات</th>
                <th className="p-5">الحالة</th>
                <th className="p-5">الموعد</th>
                <th className="p-5">الخدمة</th>
                <th className="p-5">السعر</th>
                <th className="p-5">العميل</th>
                <th className="p-5">ID</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center p-10">
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-10">
                    لا يوجد بيانات
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.VisitID}
                    className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="p-5 flex justify-center gap-4">
                      <button onClick={() => handleDelete(item.VisitID)}>
                        <MdDelete />
                      </button>
                      <button>
                        <BadgeDollarSign />
                      </button>
                      <button onClick={() => handleView(item)}>
                        <Eye />
                      </button>
                    </td>

                    <td className="p-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(item.Status || "Pending")}`}
                      >
                        {item.Status || "Pending"}
                      </span>
                    </td>

                    <td className="p-5 text-center">
                      {item.VisitDate?.split("-").reverse().join("/")}
                    </td>

                    <td className="p-5 text-center">
                      {getServiceName(item.ServiceType)}
                    </td>

                    <td className="p-5 text-center">
                      {item.QuotedPrice || "-"}
                    </td>

                    <td className="p-5 text-center">{item.CustomerName}</td>

                    <td className="p-5 text-center">T-{item.VisitID}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL (UNCHANGED LOGIC) */}
      {openView && selectedVisit && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl p-6">
            <button onClick={() => setOpenView(false)}>
              <IoClose />
            </button>

            <h2 className="text-2xl font-bold mb-5">تفاصيل الزيارة</h2>

            <p>{selectedVisit.CustomerName}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visits;
