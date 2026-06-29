import { useEffect, useMemo, useState } from "react";
import API from "@/api/axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Search, Eye, Filter, CheckCircle2, Clock3 } from "lucide-react";

const Compliments = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [report, setReport] = useState([]);

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  const handle = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/admin/complaints");

      setReport(data.data);
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
    handle();
  }, []);

  const filteredData = useMemo(() => {
    return report.filter((item) => {
      const matchesSearch =
        item.CustomerName?.toLowerCase().includes(input.toLowerCase()) ||
        item.CustomerPhone?.includes(input) ||
        item.Description?.toLowerCase().includes(input.toLowerCase());

      const matchesFilter =
        filter === "all"
          ? true
          : item.Status.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [report, input, filter]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-[#0F172A]">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Loading...
        </h2>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-[#0F172A]">
        <h2 className="text-red-500 text-2xl">{error}</h2>
      </div>
    );

  return (
    <div
      dir="rtl"
      className="p-6 min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] transition-all duration-300 text-right"
    >
      {/* Header */}

      <div className="mb-10">
        <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-3">
          إدارة خدمة العملاء والشكاوي
        </h1>

        <p className="text-gray-500 dark:text-gray-300 text-lg">
          تتبع وحل مشاكل العملاء بسهولة
          <span className="text-orange-500 font-bold mr-2">
            (إجمالي السجل: {report.length} شكوى)
          </span>
        </p>
      </div>

      {/* Filters */}

      <div className="bg-white dark:bg-[#1E293B] rounded-[35px] p-5 shadow-sm mb-8 border border-gray-100 dark:border-[#334155]">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Search */}

          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ابحث باسم العميل، الهاتف، أو محتوى الشكوى..."
              className="h-14 rounded-2xl border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A] dark:text-white pl-12 text-right"
            />
          </div>

          {/* Filter */}

          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-14 px-5 rounded-2xl bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] dark:text-white outline-none min-w-[200px] text-right"
            >
              <option value="all">كل الحالات</option>

              <option value="pending">جديدة</option>

              <option value="resolved">تم حلها</option>
            </select>

            <div className="bg-gray-100 dark:bg-[#0F172A] p-3 rounded-xl">
              <Filter className="text-gray-500" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="bg-white dark:bg-[#1E293B] rounded-[35px] overflow-hidden shadow-sm border border-gray-100 dark:border-[#334155]">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 dark:bg-[#0F172A]">
              <tr className="text-gray-500 dark:text-gray-300 text-sm">
                <th className="p-5 font-bold text-right">ID</th>

                <th className="p-5 font-bold text-right">العميل</th>

                <th className="p-5 font-bold text-right">نوع الخدمة/المشكلة</th>

                <th className="p-5 font-bold text-right">رقم الطلب</th>

                <th className="p-5 font-bold text-right">الحالة</th>

                <th className="p-5 font-bold text-right">التاريخ</th>

                <th className="p-5 font-bold text-center">التفاصيل</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.ComplaintID}
                  className="border-t border-gray-100 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#0F172A] transition"
                >
                  <td className="p-5 font-bold text-gray-700 dark:text-white">
                    #{item.ComplaintID}
                  </td>

                  <td className="p-5">
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white">
                        {item.CustomerName}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                        {item.CustomerPhone}
                      </p>
                    </div>
                  </td>

                  <td className="p-5">
                    <span className="bg-gray-100 dark:bg-[#334155] text-gray-700 dark:text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {item.ServiceType}
                    </span>
                  </td>

                  <td className="p-5 text-gray-500 dark:text-gray-300">
                    {item.OrderID || "لا يوجد"}
                  </td>

                  <td className="p-5">
                    {item.Status === "Pending" ? (
                      <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
                        <Clock3 size={16} />
                        جديدة
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                        <CheckCircle2 size={16} />
                        تم حلها
                      </div>
                    )}
                  </td>

                  <td className="p-5 text-gray-600 dark:text-gray-300 text-sm">
                    {item.CreatedAt}
                  </td>

                  <td className="p-5 text-center">
                    <Button
                      variant="ghost"
                      className="rounded-xl hover:bg-gray-100 dark:hover:bg-[#334155]"
                    >
                      <Eye size={18} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-400">
                لا توجد نتائج
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compliments;
