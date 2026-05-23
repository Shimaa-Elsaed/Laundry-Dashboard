import React, { useEffect, useMemo, useState } from "react";
import API from "@/api/axios";

import { MdDelete } from "react-icons/md";

import { IoClose } from "react-icons/io5";

import { Search, Eye, Filter, BadgeDollarSign, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const Maintences = () => {
  // ================= STATES =================

  const [maintance, setMaintance] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [openView, setOpenView] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const [editId, setEditId] = useState(null);

  const [submitLoading, setSubmitLoading] = useState(false);

  // ================= FILTERS =================

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  // ================= FORM =================

  const [formData, setFormData] = useState({
    quotedPrice: "",
    adminNote: "",
  });

  // ================= GET DATA =================

  const getMaintance = async () => {
    try {
      setLoading(true);

      setError("");

      const res = await API.get("/admin/maintenance-requests");

      setMaintance(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMaintance();
  }, []);

  // ================= UNIQUE VALUES =================

  const categories = [
    ...new Set(maintance.map((item) => item.ServiceType).filter(Boolean)),
  ];

  const statuses = [
    ...new Set(maintance.map((item) => item.Status).filter(Boolean)),
  ];

  // ================= FILTERED DATA =================

  const filteredData = useMemo(() => {
    return maintance.filter((item) => {
      // SEARCH

      const matchSearch =
        item.CustomerName?.toLowerCase().includes(search.toLowerCase()) ||
        item.CustomerPhone?.includes(search) ||
        item.RequestID?.toString().includes(search);

      // CATEGORY

      const matchCategory =
        categoryFilter === "all" ? true : item.ServiceType === categoryFilter;

      // STATUS

      const matchStatus =
        statusFilter === "all" ? true : item.Status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [maintance, search, categoryFilter, statusFilter]);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ================= OPEN EDIT =================

  const handleEdit = (item) => {
    setEditId(item.RequestID);

    setFormData({
      quotedPrice: item.QuotedPrice || "",
      adminNote: item.AdminNote || "",
    });

    setOpenModal(true);
  };

  // ================= VIEW =================

  const handleView = (item) => {
    setSelectedItem(item);

    setOpenView(true);
  };

  // ================= SEND QUOTE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);

      await API.post(`/admin/maintenance-requests/${editId}/quote`, formData);

      setOpenModal(false);

      getMaintance();
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ================= DELETE =================
  /*
  const handleDelete = async (id) => {
    const confirmDelete = confirm("هل تريد حذف الطلب ؟");

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/maintenance-requests/${id}`);

      getMaintance();
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء الحذف");
    }
  };
*/
  // ================= STATUS COLORS =================

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/15 text-yellow-500 border border-yellow-500/20";

      case "Quoted":
        return "bg-blue-500/15 text-blue-500 border border-blue-500/20";

      case "Completed":
        return "bg-green-500/15 text-green-500 border border-green-500/20";

      case "Rejected":
        return "bg-red-500/15 text-red-500 border border-red-500/20";

      case "Approved":
        return "bg-purple-500/15 text-purple-500 border border-purple-500/20";

      default:
        return "bg-zinc-500/15 text-zinc-500 border border-zinc-500/20";
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#f5f7fb] dark:bg-[#09090b] min-h-screen transition-all duration-300">
      {/* ERROR */}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6">
          {error}
        </div>
      )}

      {/* HEADER */}

      <div className="bg-white dark:bg-zinc-950 rounded-[40px] p-8 mb-8 border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
          {/* LEFT */}

          <Button className="rounded-2xl h-14 px-8 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:text-blue-400">
            {maintance.length} طلب صيانة نشط
            <Filter className="w-5 h-5 mr-2" />
          </Button>

          {/* RIGHT */}

          <div className="flex items-center gap-5">
            <div className="text-right">
              <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white">
                طلبات الصيانة
              </h1>

              <p className="text-gray-500 dark:text-zinc-400 mt-2 uppercase tracking-widest font-semibold">
                Maintenance & Repair Management
              </p>
            </div>

            <div className="w-20 h-20 rounded-3xl bg-[#030b2f] dark:bg-blue-600" />
          </div>
        </div>

        {/* FILTERS */}

        <div className="bg-[#f8fafc] dark:bg-zinc-900 rounded-[35px] border border-gray-200 dark:border-zinc-800 shadow-sm p-6 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* SEARCH */}

            <div className="relative">
              <Search className="absolute right-4 top-5 text-gray-400 w-5 h-5" />

              <input
                type="text"
                placeholder="ابحث بالرقم / اسم العميل / الهاتف / كود الصيانة..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  h-16
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-zinc-700
                  bg-white
                  dark:bg-zinc-950
                  px-14
                  outline-none
                  text-black
                  dark:text-white
                "
              />
            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="
                h-16
                rounded-2xl
                border
                border-gray-200
                dark:border-zinc-700
                bg-white
                dark:bg-zinc-950
                px-4
                outline-none
                text-black
                dark:text-white
              "
            >
              <option value="all">كل الحالات</option>

              {statuses.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {/* CATEGORY */}

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="
                h-16
                rounded-2xl
                border
                border-gray-200
                dark:border-zinc-700
                bg-white
                dark:bg-zinc-950
                px-4
                outline-none
                text-black
                dark:text-white
                md:col-span-2
              "
            >
              <option value="all">كل التصنيفات</option>

              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}

      <div className="bg-white dark:bg-zinc-950 rounded-[35px] overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f5f7fb] dark:bg-zinc-900">
              <tr>
                <th className="p-5 text-center text-zinc-900 dark:text-white">
                  العمليات
                </th>

                <th className="p-5 text-center text-zinc-900 dark:text-white">
                  التاريخ
                </th>

                <th className="p-5 text-center text-zinc-900 dark:text-white">
                  الحالة
                </th>

                <th className="p-5 text-center text-zinc-900 dark:text-white">
                  عرض السعر
                </th>

                <th className="p-5 text-center text-zinc-900 dark:text-white">
                  الخدمة
                </th>

                <th className="p-5 text-center text-zinc-900 dark:text-white">
                  العميل
                </th>

                <th className="p-5 text-center text-zinc-900 dark:text-white">
                  ID
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center p-10">
                    <div className="flex items-center justify-center gap-3 text-blue-500 font-bold">
                      <Loader2 className="animate-spin w-5 h-5" />
                      جاري تحميل البيانات...
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center p-10 text-gray-500 dark:text-zinc-400"
                  >
                    لا يوجد بيانات
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.RequestID}
                    className="
                      border-t
                      border-gray-100
                      dark:border-zinc-800
                      hover:bg-gray-50
                      dark:hover:bg-zinc-900
                      transition
                    "
                  >
                    {/* ACTIONS */}

                    <td className="p-5">
                      <div className="flex items-center justify-center gap-4">
                        {/* DELETE */}

                        <button
                          //  onClick={() => handleDelete(item.RequestID)}
                          className="
                            text-zinc-700
                            dark:text-zinc-300
                            hover:text-red-500
                            transition
                          "
                        >
                          <MdDelete className="text-xl" />
                        </button>

                        {/* PRICE */}

                        <button
                          onClick={() => handleEdit(item)}
                          className="
                            text-zinc-700
                            dark:text-zinc-300
                            hover:text-green-500
                            transition
                          "
                        >
                          <BadgeDollarSign className="w-5 h-5" />
                        </button>

                        {/* VIEW */}

                        <button
                          onClick={() => handleView(item)}
                          className="
                            text-zinc-700
                            dark:text-zinc-300
                            hover:text-blue-500
                            transition
                          "
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>

                    {/* DATE */}

                    <td className="p-5 text-center font-semibold text-zinc-700 dark:text-zinc-300">
                      {item.CreatedAt?.split(" ")[0]
                        ?.split("-")
                        .reverse()
                        .join("/")}
                    </td>

                    {/* STATUS */}

                    <td className="p-5 text-center">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
                          item.Status,
                        )}`}
                      >
                        {item.Status}
                      </span>
                    </td>

                    {/* PRICE */}

                    <td className="p-5 text-center font-bold text-zinc-900 dark:text-white">
                      {item.QuotedPrice ? (
                        `${item.QuotedPrice} ج`
                      ) : (
                        <span className="text-red-500 text-xs uppercase">
                          Pending Quote
                        </span>
                      )}
                    </td>

                    {/* SERVICE */}

                    <td className="p-5 text-center">
                      <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-sm font-bold border border-green-500/20">
                        {item.ServiceType || "شنط"}
                      </span>
                    </td>

                    {/* CUSTOMER */}

                    <td className="p-5 text-center">
                      <h3 className="font-black text-zinc-900 dark:text-white">
                        {item.CustomerName || "Unknown"}
                      </h3>

                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                        {item.CustomerPhone}
                      </p>
                    </td>

                    {/* ID */}

                    <td className="p-5 text-center font-bold text-zinc-900 dark:text-white">
                      M-{item.RequestID}#
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL QUOTE ================= */}

      {openModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-xl rounded-[35px] p-8 relative border border-gray-200 dark:border-zinc-800">
            {/* CLOSE */}

            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-5 left-5"
            >
              <IoClose className="text-3xl text-red-500" />
            </button>

            <h2 className="text-3xl font-black mb-8 text-center text-zinc-900 dark:text-white">
              إضافة عرض سعر
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* PRICE */}

              <div>
                <label className="block mb-2 font-bold text-zinc-900 dark:text-white">
                  السعر
                </label>

                <input
                  type="number"
                  name="quotedPrice"
                  value={formData.quotedPrice}
                  onChange={handleChange}
                  placeholder="ادخل السعر"
                  className="
                    w-full
                    h-14
                    border
                    border-gray-200
                    dark:border-zinc-700
                    rounded-2xl
                    px-4
                    bg-white
                    dark:bg-zinc-900
                    text-black
                    dark:text-white
                    outline-none
                  "
                />
              </div>

              {/* NOTE */}

              <div>
                <label className="block mb-2 font-bold text-zinc-900 dark:text-white">
                  ملاحظات الادمن
                </label>

                <textarea
                  name="adminNote"
                  value={formData.adminNote}
                  onChange={handleChange}
                  placeholder="اكتب الملاحظات..."
                  className="
                    w-full
                    border
                    border-gray-200
                    dark:border-zinc-700
                    rounded-2xl
                    p-4
                    min-h-[140px]
                    bg-white
                    dark:bg-zinc-900
                    text-black
                    dark:text-white
                    outline-none
                  "
                />
              </div>

              {/* SUBMIT */}

              <Button className="w-full h-14 rounded-2xl bg-[#030b2f] hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 text-lg">
                {submitLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-5 h-5" />
                    جاري الحفظ...
                  </div>
                ) : (
                  "حفظ عرض السعر"
                )}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW MODAL ================= */}

      {openView && selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-2xl rounded-[35px] p-8 relative max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-zinc-800">
            {/* CLOSE */}

            <button
              onClick={() => setOpenView(false)}
              className="absolute top-5 left-5"
            >
              <IoClose className="text-3xl text-red-500" />
            </button>

            <h2 className="text-3xl font-black mb-8 text-center text-zinc-900 dark:text-white">
              تفاصيل الطلب
            </h2>

            {/* INFO */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div className="bg-[#f8fafc] dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800">
                <h3 className="text-gray-500 dark:text-zinc-400 mb-2">
                  اسم العميل
                </h3>

                <p className="font-black text-lg text-zinc-900 dark:text-white">
                  {selectedItem.CustomerName}
                </p>
              </div>

              <div className="bg-[#f8fafc] dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800">
                <h3 className="text-gray-500 dark:text-zinc-400 mb-2">
                  رقم الهاتف
                </h3>

                <p className="font-black text-lg text-zinc-900 dark:text-white">
                  {selectedItem.CustomerPhone}
                </p>
              </div>

              <div className="bg-[#f8fafc] dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800">
                <h3 className="text-gray-500 dark:text-zinc-400 mb-2">
                  الحالة
                </h3>

                <p className="font-black text-lg text-zinc-900 dark:text-white">
                  {selectedItem.Status}
                </p>
              </div>

              <div className="bg-[#f8fafc] dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800">
                <h3 className="text-gray-500 dark:text-zinc-400 mb-2">السعر</h3>

                <p className="font-black text-lg text-zinc-900 dark:text-white">
                  {selectedItem.QuotedPrice || "لا يوجد"}
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className="bg-[#f8fafc] dark:bg-zinc-900 rounded-2xl p-5 mb-8 border border-gray-100 dark:border-zinc-800">
              <h3 className="text-gray-500 dark:text-zinc-400 mb-3">الوصف</h3>

              <p className="leading-8 text-zinc-900 dark:text-white">
                {selectedItem.Description}
              </p>
            </div>

            {/* IMAGES */}

            {selectedItem.images?.length > 0 && (
              <div>
                <h3 className="font-black text-2xl mb-5 text-zinc-900 dark:text-white">
                  الصور
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {selectedItem.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt=""
                      className="w-full h-44 rounded-3xl object-cover border border-gray-200 dark:border-zinc-800"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintences;
