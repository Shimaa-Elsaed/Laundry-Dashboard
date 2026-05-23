// ========================= Areas.jsx =========================

import React, { useEffect, useState } from "react";
import API from "@/api/axios";

import { IoIosSend } from "react-icons/io";
import { MdDelete, MdOutlineBrowserUpdated } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const Areas = () => {
  const [areas, setAreas] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    areaNameAr: "",
    areaNameEn: "",
    deliveryFee: "",
    isActive: true,
  });

  // ================= GET AREAS =================

  const getAreas = async () => {
    try {
      setLoading(true);

      setError("");

      const res = await API.get("/admin/areas");

      setAreas(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAreas();
  }, []);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ================= EDIT =================

  const handleEdit = (area) => {
    setEditId(area.AreaID);

    setFormData({
      areaNameAr: area.AreaName_ar,
      areaNameEn: area.AreaName_en,
      deliveryFee: area.DeliveryFee,
      isActive: area.IsActive === 1,
    });

    setOpenModal(true);
  };

  // ================= UPDATE =================

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await API.patch(`/admin/areas/${editId}`, formData);

      getAreas();

      setOpenModal(false);

      setEditId(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // ================= DELETE =================
/*
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف المنطقة ؟");

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/areas/${id}`);

      getAreas();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };
*/
  return (
    <div
      dir="rtl"
      className="p-4 md:p-8 min-h-screen bg-gray-50 dark:bg-zinc-900 transition-all"
    >
      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 dark:bg-blue-500/20 p-4 rounded-2xl">
            <IoIosSend className="text-3xl text-blue-700 dark:text-blue-400" />
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-white">
              إدارة المناطق
            </h1>

            <p className="text-sm text-gray-500 dark:text-zinc-400">
              إدارة مناطق التوصيل والأسعار الخاصة بها
            </p>
          </div>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 p-4 rounded-2xl mb-6">
          {error}
        </div>
      )}

      {/* TABLE */}

      <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-20 text-2xl font-bold dark:text-white">
            Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-100 dark:bg-zinc-900">
                <tr>
                  <th className="p-4 text-right dark:text-white">ID</th>

                  <th className="p-4 text-right dark:text-white">المنطقة</th>

                  <th className="p-4 text-right dark:text-white">
                    سعر التوصيل
                  </th>

                  <th className="p-4 text-right dark:text-white">الحالة</th>

                  <th className="p-4 text-center dark:text-white">العمليات</th>
                </tr>
              </thead>

              <tbody>
                {areas.map((area) => (
                  <tr
                    key={area.AreaID}
                    className="border-t border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 transition"
                  >
                    <td className="p-4 font-bold dark:text-white">
                      #{area.AreaID}
                    </td>

                    <td className="p-4 align-middle">
                      <div className="leading-tight">
                        <h2 className="font-semibold text-zinc-800 dark:text-white">
                          {area.AreaName_en}
                        </h2>

                        <p className="text-sm mt-1 text-gray-500 dark:text-zinc-400">
                          {area.AreaName_ar}
                        </p>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-orange-500">
                      {area.DeliveryFee} ج
                    </td>

                    <td className="p-4">
                      {area.IsActive === 1 ? (
                        <span className="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 px-4 py-1 rounded-full text-sm">
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 px-4 py-1 rounded-full text-sm">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEdit(area)}
                          className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center hover:scale-110 transition"
                        >
                          <MdOutlineBrowserUpdated className="text-blue-700 dark:text-blue-400 text-xl" />
                        </button>

                        <button
                         // onClick={() => handleDelete(area.AreaID)}
                          className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center hover:scale-110 transition"
                        >
                          <MdDelete className="text-red-600 dark:text-red-400 text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {areas.length === 0 && (
              <div className="text-center py-20 text-gray-500 dark:text-zinc-400">
                لا يوجد بيانات
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL */}

      {openModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-xl rounded-3xl p-6 relative border border-gray-200 dark:border-zinc-800">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 left-4 text-gray-500 dark:text-zinc-400"
            >
              <IoClose className="text-3xl" />
            </button>

            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              تعديل المنطقة
            </h2>

            <form onSubmit={handleUpdate} className="space-y-5">
              <input
                type="text"
                name="areaNameAr"
                value={formData.areaNameAr}
                onChange={handleChange}
                placeholder="الاسم بالعربي"
                className="w-full border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-2xl h-14 px-4 outline-none text-right"
              />

              <input
                type="text"
                name="areaNameEn"
                value={formData.areaNameEn}
                onChange={handleChange}
                placeholder="الاسم بالإنجليزي"
                className="w-full border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-2xl h-14 px-4 outline-none text-right"
              />

              <input
                type="number"
                name="deliveryFee"
                value={formData.deliveryFee}
                onChange={handleChange}
                placeholder="سعر التوصيل"
                className="w-full border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-2xl h-14 px-4 outline-none text-right"
              />

              <label className="flex items-center gap-3 dark:text-white">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                المنطقة مفعلة
              </label>

              <button className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-2xl h-14 font-semibold transition">
                حفظ التعديلات
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Areas;
