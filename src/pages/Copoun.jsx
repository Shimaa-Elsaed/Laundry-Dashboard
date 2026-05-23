/*import React from 'react'

const Copoun = () => {
  return (
    <div>Copoun</div>
    //https://laundary.shaarapp.com/api/admin/coupons
  )
}

export default Copoun
*/
import React, { useEffect, useState } from "react";
import API from "@/api/axios";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "Percentage",
    discountValue: "",
    minOrderAmount: "",
    usageLimit: "",
  });

  // ================= GET =================

  const getCoupons = async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/coupons");

      console.log("ghghgh", res.data);
      // console.log("gjhgkhjgkhgj", res.data.data);

      setCoupons(res.data.data);
      // setCoupons(res.data);
    } catch (err) {
      console.log(err);

      setError("Failed To Load Coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // ================= ADD =================

  const handleAddCoupon = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/admin/coupons", formData);

      console.log(res.data);

      alert("Coupon Added Successfully");

      getCoupons();

      setFormData({
        code: "",
        discountType: "Percentage",
        discountValue: "",
        minOrderAmount: "",
        usageLimit: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  // ================= DELETE =================
  /*
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are You Sure You Want To Delete This Coupon?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/coupons/${id}`);

      alert("Deleted Successfully");

      getCoupons();
    } catch (err) {
      console.log(err);
    }
  };
*/
  // ================= EDIT =================
  //هنا اما بضغط علي زرار الايديت بخلي الداتا تتملي في الفورم بالداتا القديمه ونعدل فيها بقي
  const handleEdit = (coupon) => {
    setEditId(coupon.CouponID);

    setFormData({
      code: coupon.Code,
      discountType: coupon.DiscountType,
      discountValue: coupon.DiscountValue,
      minOrderAmount: coupon.MinOrderAmount,
      usageLimit: coupon.UsageLimit,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= UPDATE =================

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();

    try {
      await API.patch(`/admin/coupons/${editId}`, formData);

      alert("Updated Successfully");

      getCoupons();

      setEditId(null);

      setFormData({
        code: "",
        discountType: "Percentage",
        discountValue: "",
        minOrderAmount: "",
        usageLimit: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-8">
      {/* TITLE */}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black">Coupons Management</h1>
      </div>

      {/* FORM */}

      <form
        onSubmit={editId ? handleUpdateCoupon : handleAddCoupon}
        className="bg-white dark:bg-zinc-900 shadow-lg rounded-3xl p-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <input
          type="text"
          name="code"
          placeholder="Coupon Code"
          value={formData.code}
          onChange={handleChange}
          className="border p-4 rounded-2xl outline-none"
        />

        <select
          name="discountType"
          value={formData.discountType}
          onChange={handleChange}
          className="border p-4 rounded-2xl outline-none"
        >
          <option value="Percentage">Percentage</option>

          <option value="FixedAmount">Fixed Amount</option>
        </select>

        <input
          type="number"
          name="discountValue"
          placeholder="Discount Value"
          value={formData.discountValue}
          onChange={handleChange}
          className="border p-4 rounded-2xl outline-none"
        />

        <input
          type="number"
          name="minOrderAmount"
          placeholder="Min Order Amount"
          value={formData.minOrderAmount}
          onChange={handleChange}
          className="border p-4 rounded-2xl outline-none"
        />

        <input
          type="number"
          name="usageLimit"
          placeholder="Usage Limit"
          value={formData.usageLimit}
          onChange={handleChange}
          className="border p-4 rounded-2xl outline-none"
        />

        <button
          className={`text-white rounded-2xl p-4 font-bold ${
            editId ? "bg-blue-500" : "bg-green-500"
          }`}
        >
          {editId ? "Update Coupon" : "Add Coupon"}
        </button>
      </form>

      {/* ERROR */}

      {error && <p className="text-red-500 mb-5">{error}</p>}

      {/* LOADING */}

      {loading ? (
        <div className="text-center text-2xl font-bold">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-zinc-900 shadow-lg rounded-3xl">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-zinc-800">
              <tr>
                <th className="p-5 text-left">ID</th>

                <th className="p-5 text-left">Code</th>

                <th className="p-5 text-left">Type</th>

                <th className="p-5 text-left">Value</th>

                <th className="p-5 text-left">Min Order</th>

                <th className="p-5 text-left">Usage Limit</th>

                <th className="p-5 text-left">Usage Count</th>

                <th className="p-5 text-left">Status</th>

                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((coupon) => (
                <tr
                  key={coupon.CouponID}
                  className="border-b dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                >
                  <td className="p-5">{coupon.CouponID}</td>

                  <td className="p-5 font-bold">{coupon.Code}</td>

                  <td className="p-5">{coupon.DiscountType}</td>

                  <td className="p-5">{coupon.DiscountValue}</td>

                  <td className="p-5">{coupon.MinOrderAmount}</td>

                  <td className="p-5">{coupon.UsageLimit}</td>

                  <td className="p-5">{coupon.UsageCount}</td>

                  <td className="p-5">
                    {coupon.IsActive ? (
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-5">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
                      >
                        Edit
                      </button>

                      <button
                        // onClick={() => handleDelete(coupon.CouponID)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {coupons.length === 0 && (
            <div className="text-center p-10 text-gray-500">
              No Coupons Found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Coupons;
