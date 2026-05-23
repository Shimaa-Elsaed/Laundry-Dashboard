import React, { useEffect, useMemo, useState } from "react";

import API from "@/api/axios";

import { IoIosSend } from "react-icons/io";

import { MdDelete, MdOutlineBrowserUpdated } from "react-icons/md";

import { IoClose } from "react-icons/io5";

import { Button } from "@/components/ui/button";

const Laundry = () => {
  // ================= STATES =================

  const [laundrys, setLaundrys] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    titleAr: "",
    titleEn: "",
    linkURL: "",
    displayOrder: "",
    isActive: true,
    type: "HOME",
    imageAr: null,
    imageEn: null,
  });

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    setFormData({
      ...formData,

      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  // ================= GET DATA =================

  const getLaundry = async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/banners");

      setLaundrys(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLaundry();
  }, []);

  // ================= FILTER =================

  const filteredData = useMemo(() => {
    return laundrys.filter((item) =>
      item.Title?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [laundrys, search]);

  // ================= OPEN ADD =================

  const openAddModal = () => {
    setEditId(null);

    setFormData({
      title: "",
      titleAr: "",
      titleEn: "",
      linkURL: "",
      displayOrder: "",
      isActive: true,
      type: "HOME",
      imageAr: null,
      imageEn: null,
    });

    setOpenModal(true);
  };

  // ================= OPEN EDIT =================

  const openEditModal = (laundry) => {
    setEditId(laundry.BannerID);

    setFormData({
      title: laundry.Title || "",

      titleAr: laundry.Title_ar || "",

      titleEn: laundry.Title_en || "",

      linkURL: laundry.LinkURL || "",

      displayOrder: laundry.DisplayOrder || "",

      isActive: laundry.IsActive === 1,

      type: laundry.Type || "HOME",

      imageAr: null,

      imageEn: null,
    });

    setOpenModal(true);
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          data.append(key, value);
        }
      });

      if (editId) {
        await API.patch(`/admin/banners/${editId}`, data);
      } else {
        await API.post("/admin/banners", data);
      }

      getLaundry();

      setOpenModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // ================= DELETE =================
  /*
  const deleteBanner = async (id) => {
    const confirmDelete = window.confirm("هل انت متأكد من حذف الاعلان ؟");

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/banners/${id}`);

      getLaundry();
    } catch (err) {
      setError(err.message);
    }
  };
*/
  return (
    <div
      dir="rtl"
      className="
        min-h-screen

        p-4
        md:p-8

        bg-gray-50
        dark:bg-zinc-900

        text-right
      "
    >
      {/* ERROR */}

      {error && (
        <div
          className="
            mb-6

            rounded-2xl

            bg-red-100
            dark:bg-red-500/20

            p-4

            text-red-700
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
        {/* LEFT */}

        <div className="flex items-center gap-4">
          <div
            className="
              rounded-2xl

              bg-blue-100
              dark:bg-blue-500/20

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
              ادارة البنرات الاعلانية
            </h1>

            <p
              className="
                mt-1

                text-gray-500
                dark:text-zinc-400
              "
            >
              تخصيص البنرات والمساحات الترويجية
            </p>
          </div>
        </div>

        {/* BUTTON */}

        <Button
          onClick={openAddModal}
          className="
            rounded-2xl

            bg-blue-700
            hover:bg-blue-800

            px-8
            py-6

            text-lg
            text-white
          "
        >
          رفع اعلان جديد
        </Button>
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

          shadow-xl
        "
      >
        {/* TOP */}

        <div
          className="
            flex
            flex-col
            gap-4

            border-b
            border-gray-200
            dark:border-zinc-800

            bg-gray-50
            dark:bg-zinc-900

            p-5

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* SEARCH */}

          <input
            type="text"
            placeholder="بحث باسم الحملة..."
            className="
              w-full
              lg:w-80

              rounded-2xl

              border
              border-gray-300
              dark:border-zinc-700

              bg-white
              dark:bg-zinc-950

              px-4
              py-3

              text-right
              text-black
              dark:text-white

              outline-none

              focus:ring-2
              focus:ring-blue-500
            "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* COUNT */}

          <div
            className="
              text-sm
              font-medium

              text-gray-500
              dark:text-zinc-400
            "
          >
            عدد البنرات :
            <span
              className="
                ms-2

                font-bold

                text-black
                dark:text-white
              "
            >
              {filteredData.length}
            </span>
          </div>
        </div>

        {/* LOADING */}

        {loading ? (
          <div
            className="
              flex
              items-center
              justify-center

              py-24

              text-2xl
              font-bold

              text-zinc-800
              dark:text-white
            "
          >
            Loading...
          </div>
        ) : filteredData.length === 0 ? (
          <div
            className="
              flex
              flex-col

              items-center
              justify-center

              py-24
            "
          >
            <h2
              className="
                text-2xl
                font-bold

                text-zinc-800
                dark:text-white
              "
            >
              لا يوجد بيانات
            </h2>

            <p
              className="
                mt-2

                text-gray-500
                dark:text-zinc-400
              "
            >
              قم باضافة اعلان جديد
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}

            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-center">
                {/* HEAD */}

                <thead
                  className="
                    bg-gray-100
                    dark:bg-zinc-900
                  "
                >
                  <tr
                    className="
                      text-gray-700
                      dark:text-zinc-300
                    "
                  >
                    <th className="p-5">#</th>

                    <th className="p-5">الصور</th>

                    <th className="p-5">العنوان</th>

                    <th className="p-5">النوع</th>

                    <th className="p-5">الحالة</th>

                    <th className="p-5">التحكم</th>
                  </tr>
                </thead>

                {/* BODY */}

                <tbody>
                  {filteredData.map((laundry) => (
                    <tr
                      key={laundry.BannerID}
                      className="
                          border-b
                          border-gray-200
                          dark:border-zinc-800

                          transition-all

                          hover:bg-blue-50
                          dark:hover:bg-zinc-900
                        "
                    >
                      {/* ID */}

                      <td className="p-5">
                        <div className="flex flex-col items-center">
                          <span
                            className="
                                text-lg
                                font-bold

                                text-zinc-800
                                dark:text-white
                              "
                          >
                            {laundry.DisplayOrder}
                          </span>

                          <span
                            className="
                                mt-1

                                text-xs

                                text-gray-400
                              "
                          >
                            #{laundry.BannerID}
                          </span>
                        </div>
                      </td>

                      {/* IMAGES */}

                      <td className="p-5">
                        <div
                          className="
                              flex
                              justify-center

                              gap-3
                            "
                        >
                          <img
                            src={laundry.ImageURL_ar}
                            alt=""
                            className="
                                h-20
                                w-28

                                rounded-2xl

                                border
                                border-gray-200
                                dark:border-zinc-700

                                object-cover
                              "
                          />

                          <img
                            src={laundry.ImageURL_en || laundry.ImageURL}
                            alt=""
                            className="
                                h-20
                                w-28

                                rounded-2xl

                                border
                                border-gray-200
                                dark:border-zinc-700

                                object-cover
                              "
                          />
                        </div>
                      </td>

                      {/* TITLE */}

                      <td
                        className="
                            p-5

                            font-semibold

                            text-zinc-800
                            dark:text-white
                          "
                      >
                        {laundry.Title}
                      </td>

                      {/* TYPE */}

                      <td className="p-5">
                        <span
                          className="
                              rounded-full

                              bg-blue-100
                              dark:bg-blue-500/20

                              px-4
                              py-2

                              text-sm

                              text-blue-700
                              dark:text-blue-400
                            "
                        >
                          {laundry.Type}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="p-5">
                        {laundry.IsActive ? (
                          <span
                            className="
                                rounded-full

                                bg-green-100
                                dark:bg-green-500/20

                                px-4
                                py-2

                                text-sm

                                text-green-700
                                dark:text-green-400
                              "
                          >
                            نشط
                          </span>
                        ) : (
                          <span
                            className="
                                rounded-full

                                bg-red-100
                                dark:bg-red-500/20

                                px-4
                                py-2

                                text-sm

                                text-red-700
                                dark:text-red-400
                              "
                          >
                            غير نشط
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td className="p-5">
                        <div
                          className="
                              flex
                              items-center
                              justify-center

                              gap-4
                            "
                        >
                          <button
                            onClick={() => openEditModal(laundry)}
                            className="
                                flex
                                h-11
                                w-11

                                items-center
                                justify-center

                                rounded-xl

                                bg-blue-100
                                dark:bg-blue-500/20

                                text-xl

                                text-blue-700
                                dark:text-blue-400

                                transition-all

                                hover:scale-110
                              "
                          >
                            <MdOutlineBrowserUpdated />
                          </button>

                          <button
                            //  onClick={() => deleteBanner(laundry.BannerID)}
                            className="
                                flex
                                h-11
                                w-11

                                items-center
                                justify-center

                                rounded-xl

                                bg-red-100
                                dark:bg-red-500/20

                                text-xl

                                text-red-700
                                dark:text-red-400

                                transition-all

                                hover:scale-110
                              "
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}

            <div className="space-y-4 p-4 lg:hidden">
              {filteredData.map((laundry) => (
                <div
                  key={laundry.BannerID}
                  className="
                    rounded-3xl

                    border
                    border-gray-200
                    dark:border-zinc-800

                    bg-white
                    dark:bg-zinc-900

                    p-4

                    text-right
                  "
                >
                  {/* TOP */}

                  <div
                    className="
                      flex
                      items-start
                      justify-between

                      gap-4
                    "
                  >
                    <div className="text-right">
                      <h2
                        className="
                          text-lg
                          font-bold

                          text-zinc-800
                          dark:text-white
                        "
                      >
                        {laundry.Title}
                      </h2>

                      <p
                        className="
                          mt-1

                          text-sm

                          text-gray-500
                        "
                      >
                        #{laundry.BannerID}
                      </p>
                    </div>

                    <span
                      className="
                        rounded-full

                        bg-blue-100
                        dark:bg-blue-500/20

                        px-3
                        py-1

                        text-xs

                        text-blue-700
                        dark:text-blue-400
                      "
                    >
                      {laundry.Type}
                    </span>
                  </div>

                  {/* IMAGES */}

                  <div className="mt-5 flex gap-3">
                    <img
                      src={laundry.ImageURL_ar}
                      alt=""
                      className="
                        h-28
                        w-1/2

                        rounded-2xl

                        object-cover
                      "
                    />

                    <img
                      src={laundry.ImageURL_en || laundry.ImageURL}
                      alt=""
                      className="
                        h-28
                        w-1/2

                        rounded-2xl

                        object-cover
                      "
                    />
                  </div>

                  {/* BOTTOM */}

                  <div
                    className="
                      mt-5

                      flex
                      items-center
                      justify-between
                    "
                  >
                    {/* STATUS */}

                    {laundry.IsActive ? (
                      <span
                        className="
                          rounded-full

                          bg-green-100
                          dark:bg-green-500/20

                          px-3
                          py-1

                          text-sm

                          text-green-700
                          dark:text-green-400
                        "
                      >
                        نشط
                      </span>
                    ) : (
                      <span
                        className="
                          rounded-full

                          bg-red-100
                          dark:bg-red-500/20

                          px-3
                          py-1

                          text-sm

                          text-red-700
                          dark:text-red-400
                        "
                      >
                        غير نشط
                      </span>
                    )}

                    {/* ACTIONS */}

                    <div className="flex gap-3">
                      <button
                        onClick={() => openEditModal(laundry)}
                        className="
                          flex
                          h-10
                          w-10

                          items-center
                          justify-center

                          rounded-xl

                          bg-blue-100
                          dark:bg-blue-500/20

                          text-blue-700
                          dark:text-blue-400
                        "
                      >
                        <MdOutlineBrowserUpdated />
                      </button>

                      <button
                        onClick={() => deleteBanner(laundry.BannerID)}
                        className="
                          flex
                          h-10
                          w-10

                          items-center
                          justify-center

                          rounded-xl

                          bg-red-100
                          dark:bg-red-500/20

                          text-red-700
                          dark:text-red-400
                        "
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
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
            dir="rtl"
            className="
              relative

              w-full
              max-w-2xl

              rounded-3xl

              border
              border-gray-200
              dark:border-zinc-800

              bg-white
              dark:bg-zinc-950

              p-6

              shadow-2xl

              text-right
            "
          >
            {/* CLOSE */}

            <button
              onClick={() => setOpenModal(false)}
              className="
                absolute
                left-4
                top-4

                text-2xl

                text-gray-500
                dark:text-zinc-400
              "
            >
              <IoClose />
            </button>

            {/* TITLE */}

            <h2
              className="
                mb-6

                text-2xl
                font-bold

                text-zinc-800
                dark:text-white
              "
            >
              {editId ? "تعديل الاعلان" : "اضافة اعلان"}
            </h2>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* TITLES */}

              <div
                className="
                  grid
                  gap-4

                  md:grid-cols-2
                "
              >
                <input
                  type="text"
                  name="titleAr"
                  placeholder="العنوان عربي"
                  value={formData.titleAr}
                  onChange={handleChange}
                  className="
                    rounded-2xl

                    border
                    border-gray-300
                    dark:border-zinc-700

                    bg-white
                    dark:bg-zinc-900

                    p-3

                    text-right
                    text-black
                    dark:text-white

                    outline-none

                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

                <input
                  type="text"
                  name="titleEn"
                  placeholder="العنوان انجليزي"
                  value={formData.titleEn}
                  onChange={handleChange}
                  className="
                    rounded-2xl

                    border
                    border-gray-300
                    dark:border-zinc-700

                    bg-white
                    dark:bg-zinc-900

                    p-3

                    text-right
                    text-black
                    dark:text-white

                    outline-none

                    focus:ring-2
                    focus:ring-blue-500
                  "
                />
              </div>

              {/* LINK */}

              <input
                type="text"
                name="linkURL"
                placeholder="الرابط"
                value={formData.linkURL}
                onChange={handleChange}
                className="
                  w-full

                  rounded-2xl

                  border
                  border-gray-300
                  dark:border-zinc-700

                  bg-white
                  dark:bg-zinc-900

                  p-3

                  text-right
                  text-black
                  dark:text-white

                  outline-none

                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              {/* ORDER + TYPE */}

              <div
                className="
                  grid
                  gap-4

                  md:grid-cols-2
                "
              >
                <input
                  type="number"
                  name="displayOrder"
                  placeholder="الترتيب"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  className="
                    rounded-2xl

                    border
                    border-gray-300
                    dark:border-zinc-700

                    bg-white
                    dark:bg-zinc-900

                    p-3

                    text-right
                    text-black
                    dark:text-white

                    outline-none

                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="
                    rounded-2xl

                    border
                    border-gray-300
                    dark:border-zinc-700

                    bg-white
                    dark:bg-zinc-900

                    p-3

                    text-right
                    text-black
                    dark:text-white

                    outline-none

                    focus:ring-2
                    focus:ring-blue-500
                  "
                >
                  <option value="HOME">HOME</option>

                  <option value="APP">APP</option>
                </select>
              </div>

              {/* IMAGES */}

              <div
                className="
                  grid
                  gap-4

                  md:grid-cols-2
                "
              >
                <div>
                  <label
                    className="
                      mb-2
                      block

                      text-sm
                      font-medium

                      text-zinc-700
                      dark:text-zinc-300
                    "
                  >
                    صورة عربي
                  </label>

                  <input
                    type="file"
                    name="imageAr"
                    onChange={handleChange}
                    className="
                      w-full

                      rounded-2xl

                      border
                      border-gray-300
                      dark:border-zinc-700

                      bg-white
                      dark:bg-zinc-900

                      p-2

                      text-black
                      dark:text-white
                    "
                  />
                </div>

                <div>
                  <label
                    className="
                      mb-2
                      block

                      text-sm
                      font-medium

                      text-zinc-700
                      dark:text-zinc-300
                    "
                  >
                    صورة انجليزي
                  </label>

                  <input
                    type="file"
                    name="imageEn"
                    onChange={handleChange}
                    className="
                      w-full

                      rounded-2xl

                      border
                      border-gray-300
                      dark:border-zinc-700

                      bg-white
                      dark:bg-zinc-900

                      p-2

                      text-black
                      dark:text-white
                    "
                  />
                </div>
              </div>

              {/* STATUS */}

              <label
                className="
                  flex
                  items-center

                  gap-3

                  text-sm

                  text-zinc-700
                  dark:text-zinc-300
                "
              >
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                اعلان نشط
              </label>

              {/* BUTTON */}

              <Button
                type="submit"
                className="
                  w-full

                  rounded-2xl

                  bg-blue-700
                  hover:bg-blue-800

                  py-6

                  text-lg
                  text-white
                "
              >
                {editId ? "حفظ التعديلات" : "اضافة اعلان"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Laundry;
