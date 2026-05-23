import React, { useEffect, useMemo, useState } from "react";
import API from "@/api/axios";

import { MdOutlineBrowserUpdated } from "react-icons/md";
import { Search, X } from "lucide-react";

const Earnings = () => {
  // ================= STATES =================

  const [earns, setEarns] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [error, setError] = useState("");

  const [editId, setEditId] = useState(null);

  // ================= FORM DATA =================

  const [formData, setFormData] = useState({
    partnerNameAr: "",
    partnerNameEn: "",
    ownerName: "",
    phoneNumber: "",
    email: "",
    areaID: "",
    addressDetails: "",
    partnerType: "",
    commissionRate: "",
    isActive: true,
    isBlocked: false,
  });

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,

      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ================= GET DATA =================

  const getEarns = async () => {
    try {
      setLoading(true);

      setError("");

      const res = await API.get("/admin/partners");

      setEarns(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEarns();
  }, []);

  // ================= OPEN EDIT MODAL =================

  const update = (earn) => {
    setEditId(earn.PartnerID);

    setFormData({
      partnerNameAr: earn.PartnerName_ar || "",
      partnerNameEn: earn.PartnerName_en || "",
      ownerName: earn.OwnerName || "",
      phoneNumber: earn.PhoneNumber || "",
      email: earn.Email || "",
      areaID: earn.AreaID || "",
      addressDetails: earn.AddressDetails || "",
      partnerType: earn.PartnerType || "",
      commissionRate: earn.CommissionRate || "",
      isActive: earn.IsActive === 1,
      isBlocked: false,
    });

    setOpen(true);
  };

  // ================= UPDATE PARTNER =================

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await API.patch(`/admin/partners/${editId}`, formData);

      alert("تم تعديل الشريك بنجاح");

      setOpen(false);

      getEarns();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // ================= SEARCH FILTER =================

  const filteredPartners = useMemo(() => {
    return earns.filter((item) => {
      const partnerName = item?.PartnerName?.toLowerCase() || "";
      const phone = item?.PhoneNumber?.toLowerCase() || "";
      const status = item?.OperatingStatus?.toLowerCase() || "";
      const searchValue = search.toLowerCase();

      return (
        partnerName.includes(searchValue) ||
        phone.includes(searchValue) ||
        status.includes(searchValue)
      );
    });
  }, [earns, search]);

  return (
    <div
      dir="rtl"
      className="p-3 md:p-6 bg-gray-50 dark:bg-[#0f172a] min-h-screen transition-all"
    >
      {/* ================= HEADER ================= */}

      <div className="mb-8 text-right">
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-white">
          شبكة المغاسل الشريكة
        </h1>

        <p className="text-gray-500 dark:text-gray-300 mt-2">
          إدارة التعاقدات والمستحقات لكافة المغاسل
        </p>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-2xl mb-6 text-right">
          {error}
        </div>
      )}

      {/* ================= TABLE CARD ================= */}

      <div className="bg-white dark:bg-[#1e293b] rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
        {/* SEARCH */}

        <div className="p-4 md:p-6 border-b border-gray-100 dark:border-slate-700">
          <div className="relative w-full md:w-96 mr-auto">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />

            <input
              type="text"
              placeholder="ابحث..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                bg-gray-50
                dark:bg-[#0f172a]
                dark:text-white
                border
                border-gray-200
                dark:border-slate-700
                rounded-2xl
                py-3
                pr-12
                pl-4
                outline-none
                text-right
              "
            />
          </div>
        </div>

        {/* TABLE */}

        {loading ? (
          <div className="text-center py-20 text-2xl font-bold dark:text-white">
            Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-right">
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr className="text-gray-700 dark:text-white">
                  <th className="p-5 text-right">ID</th>
                  <th className="p-5 text-right">اسم المغسلة</th>
                  <th className="p-5 text-right">الجوال</th>
                  <th className="p-5 text-right">العمولة</th>
                  <th className="p-5 text-right">الحالة</th>
                  <th className="p-5 text-center">التعديل</th>
                </tr>
              </thead>

              <tbody>
                {filteredPartners.map((earn) => (
                  <tr
                    key={earn.PartnerID}
                    className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <td className="p-5 dark:text-white">#{earn.PartnerID}</td>

                    <td className="p-5 font-semibold dark:text-white">
                      {earn.PartnerName}
                    </td>

                    <td className="p-5 dark:text-gray-300">
                      {earn.PhoneNumber}
                    </td>

                    <td className="p-5 dark:text-gray-300">
                      {earn.CommissionRate}%
                    </td>

                    <td className="p-5 dark:text-gray-300">
                      {earn.OperatingStatus}
                    </td>

                    <td className="p-5">
                      <div className="flex justify-center">
                        <button
                          onClick={() => update(earn)}
                          className="
                            size-10
                            rounded-xl
                            bg-blue-100
                            text-blue-600
                            hover:bg-blue-200
                            dark:bg-slate-700
                            dark:text-white
                            transition-all
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <MdOutlineBrowserUpdated size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-[#1e293b] w-full max-w-3xl rounded-3xl p-6 md:p-8 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 left-4 bg-gray-100 dark:bg-slate-700 p-2 rounded-xl"
            >
              <X size={18} className="dark:text-white" />
            </button>

            <h2 className="text-2xl font-bold mb-6 dark:text-white text-right">
              تعديل بيانات الشريك
            </h2>

            <form
              onSubmit={handleUpdate}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {[
                "partnerNameAr",
                "partnerNameEn",
                "ownerName",
                "phoneNumber",
                "email",
                "commissionRate",
                "partnerType",
                "areaID",
              ].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field}
                  className="border dark:border-slate-700 dark:bg-[#0f172a] dark:text-white rounded-2xl p-4 text-right"
                />
              ))}

              <textarea
                name="addressDetails"
                value={formData.addressDetails}
                onChange={handleChange}
                placeholder="تفاصيل العنوان"
                className="border dark:border-slate-700 dark:bg-[#0f172a] dark:text-white rounded-2xl p-4 md:col-span-2 h-32 text-right"
              />

              <div className="flex items-center gap-3 dark:text-white justify-end">
                <label>نشط</label>

                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center gap-3 dark:text-white justify-end">
                <label>محظور</label>

                <input
                  type="checkbox"
                  name="isBlocked"
                  checked={formData.isBlocked}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold"
              >
                حفظ التعديلات
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earnings;
