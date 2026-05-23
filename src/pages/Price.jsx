import React, { useEffect, useMemo, useState } from "react";

import API from "@/api/axios";

import { IoIosSend } from "react-icons/io";

import { MdDelete, MdOutlineBrowserUpdated } from "react-icons/md";

import { IoClose } from "react-icons/io5";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

const Price = () => {
  // ================= STATES =================

  const [price, setPrice] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [editId, setEditId] = useState(null);

  // FILTERS
  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("all");

  const [typeFilter, setTypeFilter] = useState("all");

  const [priceFilter, setPriceFilter] = useState("all");

  // FORM
  const [formData, setFormData] = useState({
    categoryID: "",

    nameAr: "",

    nameEn: "",

    price: "",

    isActive: true,

    serviceType: "",

    allowPackingOption: false,

    displayOrder: 0,

    descriptionAr: "",

    descriptionEn: "",

    icon: null,
  });

  // ================= GET DATA =================

  const getprice = async () => {
    try {
      setLoading(true);

      setError("");

      const res = await API.get("/admin/services");

      setPrice(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getprice();
  }, []);

  // ================= FILTER OPTIONS =================

  const categories = [...new Set(price.map((item) => item.CategoryName_en))];

  const types = [...new Set(price.map((item) => item.ServiceType))];

  // ================= FILTERED DATA =================

  const filteredData = useMemo(() => {
    return price.filter((item) => {
      // SEARCH
      const matchSearch =
        item.Name_en?.toLowerCase().includes(search.toLowerCase()) ||
        item.Name_ar?.includes(search);

      // CATEGORY
      const matchCategory =
        categoryFilter === "all" || item.CategoryName_en === categoryFilter;

      // TYPE
      const matchType = typeFilter === "all" || item.ServiceType === typeFilter;

      // PRICE
      let matchPrice = true;

      if (priceFilter === "0-50") {
        matchPrice = Number(item.Price) <= 50;
      } else if (priceFilter === "50-100") {
        matchPrice = Number(item.Price) > 50 && Number(item.Price) <= 100;
      } else if (priceFilter === "100+") {
        matchPrice = Number(item.Price) > 100;
      }

      return matchSearch && matchCategory && matchType && matchPrice;
    });
  }, [price, search, categoryFilter, typeFilter, priceFilter]);

  // ================= OPEN ADD =================

  const handleOpenAdd = () => {
    setEditId(null);

    setFormData({
      categoryID: "",

      nameAr: "",

      nameEn: "",

      price: "",

      isActive: true,

      serviceType: "",

      allowPackingOption: false,

      displayOrder: 0,

      descriptionAr: "",

      descriptionEn: "",

      icon: null,
    });

    setOpenModal(true);
  };

  // ================= OPEN EDIT =================

  const handleEdit = (item) => {
    setEditId(item.ServiceID);

    setFormData({
      categoryID: item.CategoryID || "",

      nameAr: item.Name_ar || "",

      nameEn: item.Name_en || "",

      price: item.Price || "",

      isActive: item.IsActive,

      serviceType: item.ServiceType || "",

      allowPackingOption: item.AllowPackingOption,

      displayOrder: item.DisplayOrder || 0,

      descriptionAr: item.Description_ar || "",

      descriptionEn: item.Description_en || "",

      icon: null,
    });

    setOpenModal(true);
  };

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      if (editId) {
        await API.patch(`/admin/services/${editId}`, data);
      } else {
        await API.post("/admin/services", data);
      }

      await getprice();

      setOpenModal(false);
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Something wrong");
    }
  };

  // ================= DELETE =================
  /*
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("هل متأكد من حذف الخدمة ؟");

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/services/${id}`);

      getprice();
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Delete failed");
    }
  };
*/
  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        bg-gray-100
        dark:bg-zinc-900
        p-4
        md:p-6
      "
    >
      {/* ERROR */}

      {error && (
        <div
          className="
            mb-6
            rounded-2xl
            border
            border-red-200
            bg-red-100
            dark:bg-red-500/10
            dark:border-red-500/20
            p-4
            text-red-600
            dark:text-red-400
            text-right
          "
        >
          {error}
        </div>
      )}

      {/* HEADER */}

      <div
        className="
          mb-8
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div className="flex items-center gap-4">
          <div
            className="
              rounded-2xl
              bg-blue-100
              dark:bg-blue-500/10
              p-4
            "
          >
            <IoIosSend
              className="
                text-3xl
                text-blue-700
                dark:text-blue-400
              "
            />
          </div>

          <div className="text-right">
            <h1
              className="
                text-2xl
                md:text-3xl
                font-bold
                text-zinc-800
                dark:text-white
              "
            >
              قائمة الأسعار
            </h1>

            <p
              className="
                mt-1
                text-sm
                md:text-base
                text-gray-500
                dark:text-zinc-400
              "
            >
              إدارة الخدمات والأسعار والتعديلات
            </p>
          </div>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="
            h-14
            rounded-2xl
            bg-blue-700
            hover:bg-blue-800
            px-8
            text-base
            text-white
          "
        >
          إضافة خدمة جديدة
        </Button>
      </div>

      {/* FILTERS */}

      <div
        className="
          mb-8
          rounded-3xl
          border
          border-gray-200
          dark:border-zinc-800
          bg-white
          dark:bg-zinc-950
          p-5
          shadow-sm
        "
      >
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-4
          "
        >
          {/* SEARCH */}

          <div className="relative">
            <Search
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                w-5
                h-5
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="بحث بالاسم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                h-14
                rounded-2xl
                border
                border-gray-200
                dark:border-zinc-700
                bg-white
                dark:bg-zinc-900
                pr-12
                pl-4
                text-right
                text-zinc-800
                dark:text-white
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          {/* CATEGORY */}

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="
              h-14
              rounded-2xl
              border
              border-gray-200
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-900
              px-4
              text-right
              text-zinc-800
              dark:text-white
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >
            <option value="all">كل التصنيفات</option>

            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* TYPE */}

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="
              h-14
              rounded-2xl
              border
              border-gray-200
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-900
              px-4
              text-right
              text-zinc-800
              dark:text-white
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >
            <option value="all">كل الأنواع</option>

            {types.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* PRICE */}

          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="
              h-14
              rounded-2xl
              border
              border-gray-200
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-900
              px-4
              text-right
              text-zinc-800
              dark:text-white
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >
            <option value="all">كل الأسعار</option>

            <option value="0-50">أقل من 50</option>

            <option value="50-100">من 50 إلى 100</option>

            <option value="100+">أكثر من 100</option>
          </select>
        </div>
      </div>

      {/* TABLE */}

      <div
        className="
          overflow-hidden
          rounded-3xl
          border
          border-gray-200
          dark:border-zinc-800
          bg-white
          dark:bg-zinc-950
          shadow-sm
        "
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-right">
            <thead
              className="
                bg-gray-100
                dark:bg-zinc-900
              "
            >
              <tr>
                <th className="p-5 text-right text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  الصورة
                </th>

                <th className="p-5 text-right text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  الاسم
                </th>

                <th className="p-5 text-right text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  التصنيف
                </th>

                <th className="p-5 text-right text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  النوع
                </th>

                <th className="p-5 text-right text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  السعر
                </th>

                <th className="p-5 text-center text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  التحكم
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="
                      p-10
                      text-center
                      text-zinc-600
                      dark:text-zinc-300
                    "
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="
                      p-10
                      text-center
                      text-zinc-600
                      dark:text-zinc-300
                    "
                  >
                    لا يوجد بيانات
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.ServiceID}
                    className="
                      border-t
                      border-gray-100
                      dark:border-zinc-800
                      hover:bg-gray-50
                      dark:hover:bg-zinc-900
                      transition
                    "
                  >
                    <td className="p-5">
                      <img
                        src={item.Icon}
                        alt={item.Name_en}
                        className="
                          w-16
                          h-16
                          rounded-2xl
                          object-cover
                          border
                          border-gray-200
                          dark:border-zinc-700
                        "
                      />
                    </td>

                    <td className="p-4 align-middle text-right">
                      <div className="leading-tight">
                        <h2
                          className="
                            font-semibold
                            text-[15px]
                            text-zinc-800
                            dark:text-white
                          "
                        >
                          {item.Name_en}
                        </h2>

                        <p
                          className="
                            text-sm
                            mt-0.5
                            text-gray-500
                            dark:text-zinc-400
                          "
                        >
                          {item.Name_ar}
                        </p>
                      </div>
                    </td>

                    <td className="p-5 text-zinc-700 dark:text-zinc-300 text-right">
                      {item.CategoryName_en}
                    </td>

                    <td className="p-5 text-right">
                      <span
                        className="
                          rounded-full
                          bg-blue-100
                          dark:bg-blue-500/10
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-blue-700
                          dark:text-blue-400
                        "
                      >
                        {item.ServiceType}
                      </span>
                    </td>

                    <td className="p-5 font-bold text-orange-500 text-right">
                      {item.Price} ج
                    </td>

                    <td className="p-5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="
                            flex
                            items-center
                            justify-center
                            w-11
                            h-11
                            rounded-2xl
                            bg-blue-100
                            dark:bg-blue-500/10
                            hover:scale-105
                            transition
                          "
                        >
                          <MdOutlineBrowserUpdated
                            className="
                              text-xl
                              text-blue-700
                              dark:text-blue-400
                            "
                          />
                        </button>

                        <button
                          // onClick={() => handleDelete(item.ServiceID)}
                          className="
                            flex
                            items-center
                            justify-center
                            w-11
                            h-11
                            rounded-2xl
                            bg-red-100
                            dark:bg-red-500/10
                            hover:scale-105
                            transition
                          "
                        >
                          <MdDelete
                            className="
                              text-xl
                              text-red-600
                              dark:text-red-400
                            "
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}

      {openModal && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            p-4
          "
        >
          <div
            className="
              relative
              max-h-[90vh]
              w-full
              max-w-4xl
              overflow-y-auto
              rounded-3xl
              bg-white
              dark:bg-zinc-950
              p-6
              shadow-2xl
            "
          >
            <button
              onClick={() => setOpenModal(false)}
              className="
                absolute
                left-5
                top-5
                flex
                items-center
                justify-center
                w-10
                h-10
                rounded-full
                bg-red-100
                dark:bg-red-500/10
              "
            >
              <IoClose
                className="
                  text-2xl
                  text-red-600
                  dark:text-red-400
                "
              />
            </button>

            <h2
              className="
                mb-8
                text-2xl
                md:text-3xl
                font-bold
                text-zinc-800
                dark:text-white
                text-right
              "
            >
              {editId ? "تعديل الخدمة" : "إضافة خدمة"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
              "
            >
              <input
                type="text"
                name="nameAr"
                placeholder="الاسم بالعربي"
                value={formData.nameAr}
                onChange={handleChange}
                className="
                  h-14
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-zinc-700
                  bg-white
                  dark:bg-zinc-900
                  px-4
                  text-right
                  text-zinc-800
                  dark:text-white
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <input
                type="text"
                name="nameEn"
                placeholder="الاسم بالانجليزي"
                value={formData.nameEn}
                onChange={handleChange}
                className="
                  h-14
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-zinc-700
                  bg-white
                  dark:bg-zinc-900
                  px-4
                  text-right
                  text-zinc-800
                  dark:text-white
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <input
                type="number"
                name="price"
                placeholder="السعر"
                value={formData.price}
                onChange={handleChange}
                className="
                  h-14
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-zinc-700
                  bg-white
                  dark:bg-zinc-900
                  px-4
                  text-right
                  text-zinc-800
                  dark:text-white
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <input
                type="number"
                name="categoryID"
                placeholder="Category ID"
                value={formData.categoryID}
                onChange={handleChange}
                className="
                  h-14
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-zinc-700
                  bg-white
                  dark:bg-zinc-900
                  px-4
                  text-right
                  text-zinc-800
                  dark:text-white
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <input
                type="text"
                name="serviceType"
                placeholder="نوع الخدمة"
                value={formData.serviceType}
                onChange={handleChange}
                className="
                  h-14
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-zinc-700
                  bg-white
                  dark:bg-zinc-900
                  px-4
                  text-right
                  text-zinc-800
                  dark:text-white
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <input
                type="number"
                name="displayOrder"
                placeholder="الترتيب"
                value={formData.displayOrder}
                onChange={handleChange}
                className="
                  h-14
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-zinc-700
                  bg-white
                  dark:bg-zinc-900
                  px-4
                  text-right
                  text-zinc-800
                  dark:text-white
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <textarea
                name="descriptionAr"
                placeholder="الوصف بالعربي"
                value={formData.descriptionAr}
                onChange={handleChange}
                className="
                  min-h-[120px]
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-zinc-700
                  bg-white
                  dark:bg-zinc-900
                  p-4
                  text-right
                  text-zinc-800
                  dark:text-white
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <textarea
                name="descriptionEn"
                placeholder="الوصف بالانجليزي"
                value={formData.descriptionEn}
                onChange={handleChange}
                className="
                  min-h-[120px]
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-zinc-700
                  bg-white
                  dark:bg-zinc-900
                  p-4
                  text-right
                  text-zinc-800
                  dark:text-white
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <input
                type="file"
                name="icon"
                onChange={handleChange}
                className="
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-zinc-700
                  bg-white
                  dark:bg-zinc-900
                  p-4
                  text-zinc-700
                  dark:text-white
                "
              />

              <div className="flex flex-col gap-4 text-right">
                <label
                  className="
                    flex
                    items-center
                    justify-end
                    gap-3
                    text-zinc-700
                    dark:text-zinc-300
                  "
                >
                  <span>Active</span>

                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                </label>

                <label
                  className="
                    flex
                    items-center
                    justify-end
                    gap-3
                    text-zinc-700
                    dark:text-zinc-300
                  "
                >
                  <span>Allow Packing</span>

                  <input
                    type="checkbox"
                    name="allowPackingOption"
                    checked={formData.allowPackingOption}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    bg-blue-700
                    hover:bg-blue-800
                    text-lg
                    text-white
                  "
                >
                  {editId ? "تحديث الخدمة" : "إضافة الخدمة"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Price;
