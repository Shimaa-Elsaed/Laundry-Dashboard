import React, { useEffect, useState } from "react";
import API from "@/api/axios";

import { IoIosSend } from "react-icons/io";

import { MdDelete, MdOutlineBrowserUpdated } from "react-icons/md";

import { IoClose } from "react-icons/io5";

import { Button } from "@/components/ui/button";

const Ranking = () => {
  // ================= STATES =================

  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    categoryNameAr: "",
    categoryNameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    displayOrder: "",
    systemIdentifier: "",
    showInHome: true,
    icon: null,
  });

  // ================= GET =================

  const getRanks = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/admin/categories");
      setRanks(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRanks();
  }, []);

  // ================= DELETE =================
  /*
  const deleteRank = async (id) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف التصنيف ؟");
    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/categories/${id}`);
      getRanks();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };
*/
  // ================= CHANGE =================

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  // ================= OPEN ADD =================

  const openAddModal = () => {
    setEditId(null);

    setFormData({
      categoryNameAr: "",
      categoryNameEn: "",
      descriptionAr: "",
      descriptionEn: "",
      displayOrder: "",
      systemIdentifier: "",
      showInHome: true,
      icon: null,
    });

    setOpenModal(true);
  };

  // ================= EDIT =================

  const handleEdit = (rank) => {
    setEditId(rank.CategoryID);

    setFormData({
      categoryNameAr: rank.CategoryName_ar,
      categoryNameEn: rank.CategoryName_en,
      descriptionAr: rank.Description_ar,
      descriptionEn: rank.Description_en,
      displayOrder: rank.DisplayOrder,
      systemIdentifier: rank.SystemIdentifier,
      showInHome: rank.ShowInHome === 1,
      icon: null,
    });

    setOpenModal(true);
  };

  // ================= FORM DATA =================

  const createFormData = () => {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    return data;
  };

  // ================= ADD =================

  const handleAddCategory = async (e) => {
    e.preventDefault();

    try {
      const data = createFormData();

      await API.post("/admin/categories", data);

      alert("تم إضافة التصنيف بنجاح");

      setOpenModal(false);
      getRanks();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // ================= UPDATE =================

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const data = createFormData();

      await API.patch(`/admin/categories/${editId}`, data);

      alert("تم تعديل التصنيف بنجاح");

      setOpenModal(false);
      getRanks();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div
      dir="rtl"
      className="p-3 md:p-8 bg-gray-50 dark:bg-[#0f172a] min-h-screen"
    >
      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-2xl mb-6 text-right">
          {error}
        </div>
      )}

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 dark:bg-slate-700 p-4 rounded-2xl">
            <IoIosSend className="text-blue-700 dark:text-white text-3xl" />
          </div>

          <div className="text-right">
            <h1 className="text-2xl font-bold dark:text-white">
              تصنيفات المتجر
            </h1>

            <p className="text-gray-500 dark:text-gray-300 mt-1">
              تنظيم المنتجات في مجموعات
            </p>
          </div>
        </div>

        <Button
          onClick={openAddModal}
          className="bg-blue-700 hover:bg-blue-800 text-white rounded-2xl px-8 py-6"
        >
          إضافة تصنيف جديد
        </Button>
      </div>

      {/* TABLE */}

      <div className="bg-white dark:bg-[#1e293b] rounded-3xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-2xl font-bold dark:text-white">
            Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-right">
              <thead className="bg-gray-100 dark:bg-slate-800">
                <tr className="dark:text-white">
                  <th className="p-5 text-right">الترتيب</th>

                  <th className="p-5 text-center">الأيقونة</th>

                  <th className="p-5 text-right">اسم التصنيف</th>

                  <th className="p-5 text-center">الظهور</th>

                  <th className="p-5 text-center">العمليات</th>
                </tr>
              </thead>

              <tbody>
                {ranks.map((rank) => (
                  <tr
                    key={rank.CategoryID}
                    className="
                      border-b
                      dark:border-slate-700
                      hover:bg-gray-50
                      dark:hover:bg-slate-800
                      transition
                    "
                  >
                    {/* ORDER */}

                    <td className="p-5 dark:text-white align-top text-right">
                      <div className="flex flex-col">
                        <span className="font-bold">#{rank.DisplayOrder}</span>

                        <span className="text-sm text-gray-400">
                          ID: {rank.CategoryID}
                        </span>
                      </div>
                    </td>

                    {/* IMAGE */}

                    <td className="p-5 align-top">
                      <div className="flex justify-center">
                        <img
                          src={rank.Icon}
                          alt={rank.CategoryName_en}
                          className="
                            w-14
                            h-14
                            rounded-2xl
                            object-cover
                            border
                          "
                        />
                      </div>
                    </td>

                    {/* NAME */}

                    <td className="p-5 align-top text-right">
                      <div className="flex flex-col">
                        <span className="font-bold dark:text-white">
                          {rank.CategoryName_ar}
                        </span>

                        <span className="text-sm text-gray-500">
                          {rank.CategoryName_en}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}

                    <td className="p-5 text-center align-top">
                      {rank.ShowInHome === 1 ? (
                        <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full">
                          ظاهر
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full">
                          مخفي
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}

                    <td className="p-5 align-top">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(rank)}
                          className="
                            bg-blue-100
                            dark:bg-slate-700
                            p-3
                            rounded-xl
                            hover:scale-105
                            transition
                          "
                        >
                          <MdOutlineBrowserUpdated className="text-lg dark:text-white" />
                        </button>

                        <button
                          //onClick={() => deleteRank(rank.CategoryID)}
                          className="
                            bg-red-100
                            dark:bg-slate-700
                            p-3
                            rounded-xl
                            hover:scale-105
                            transition
                          "
                        >
                          <MdDelete className="text-lg text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {ranks.length === 0 && (
              <div className="text-center py-16 text-gray-500 dark:text-gray-300">
                لا توجد تصنيفات حاليا
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL */}

      {openModal && (
        <div
          className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            p-4
            z-50
          "
        >
          <div
            className="
              bg-white
              dark:bg-[#1e293b]

              w-full
              max-w-2xl

              rounded-3xl
              p-6

              relative

              max-h-[90vh]
              overflow-y-auto
            "
          >
            {/* CLOSE */}

            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-5 left-5 dark:text-white"
            >
              <IoClose size={30} />
            </button>

            {/* TITLE */}

            <h2 className="text-2xl font-bold mb-6 dark:text-white text-right">
              {editId ? "تعديل التصنيف" : "إضافة تصنيف"}
            </h2>

            {/* FORM */}

            <form
              onSubmit={editId ? handleUpdate : handleAddCategory}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {/* NAME AR */}

              <input
                name="categoryNameAr"
                value={formData.categoryNameAr}
                onChange={handleChange}
                placeholder="الاسم بالعربي"
                className="
                  border
                  dark:bg-slate-800
                  dark:text-white
                  p-4
                  rounded-2xl
                  text-right
                "
              />

              {/* NAME EN */}

              <input
                name="categoryNameEn"
                value={formData.categoryNameEn}
                onChange={handleChange}
                placeholder="الاسم بالإنجليزي"
                className="
                  border
                  dark:bg-slate-800
                  dark:text-white
                  p-4
                  rounded-2xl
                  text-right
                "
              />

              {/* DISPLAY */}

              <input
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                placeholder="الترتيب"
                className="
                  border
                  dark:bg-slate-800
                  dark:text-white
                  p-4
                  rounded-2xl
                  text-right
                "
              />

              {/* IDENTIFIER */}

              <input
                name="systemIdentifier"
                value={formData.systemIdentifier}
                onChange={handleChange}
                placeholder="System Identifier"
                className="
                  border
                  dark:bg-slate-800
                  dark:text-white
                  p-4
                  rounded-2xl
                  text-right
                "
              />

              {/* FILE */}

              <input
                type="file"
                name="icon"
                onChange={handleChange}
                className="
                  border
                  p-4
                  rounded-2xl
                  dark:bg-slate-800
                  dark:text-white
                "
              />

              {/* CHECKBOX */}

              <div className="flex items-center gap-3 dark:text-white justify-start">
                <input
                  type="checkbox"
                  name="showInHome"
                  checked={formData.showInHome}
                  onChange={handleChange}
                />

                <span>يظهر في الرئيسية</span>
              </div>

              {/* BUTTON */}

              <button
                className="
                  md:col-span-2
                  bg-blue-700
                  hover:bg-blue-800
                  text-white
                  py-4
                  rounded-2xl
                  transition
                "
              >
                حفظ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ranking;
