import API from "@/api/axios";
import { useEffect, useState } from "react";

import { IoBarChart } from "react-icons/io5";

import { Button } from "@/components/ui/button";

import { FaDollarSign } from "react-icons/fa";
import { FaHandHoldingDollar, FaSackDollar } from "react-icons/fa6";
import { FaHandsWash } from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Reports = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const handleData = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/admin/reports");

      setReport(data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  const datas = [
    {
      icon: <FaDollarSign />,
      name: "إجمالي الطلبات",
      desc: report?.summary?.totalOrders || 0,
      price: "+12%",
    },
    {
      icon: <FaHandHoldingDollar />,
      name: "إجمالي الأرباح",
      desc: report?.summary?.totalRevenue || 0,
      price: "+11%",
    },
    {
      icon: <FaSackDollar />,
      name: "أرباح الكاش",
      desc: report?.summary?.cashRevenue || 0,
      price: "+21%",
    },
    {
      icon: <FaHandsWash />,
      name: "أرباح الفيزا",
      desc: report?.summary?.visaRevenue || 0,
      price: "+31%",
    },
  ];

  const monthlyData =
    report?.charts?.monthly?.map((item) => ({
      month: item.month,
      orders: item.orders,
      revenue: Number(item.revenue),
    })) || [];

  const categoriesData =
    report?.charts?.categories?.map((item) => ({
      name: item.label,
      volume: item.volume,
      revenue: Number(item.revenue),
    })) || [];

  if (loading) {
    return (
      <div
        dir="rtl"
        className="flex items-center justify-center h-screen bg-gray-100 dark:bg-zinc-950"
      >
        <h2 className="text-2xl font-bold dark:text-white">Loading...</h2>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-100 dark:bg-zinc-950 p-4 md:p-8 transition-all"
    >
      {/* ERROR */}

      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-2xl mb-6 text-right">
          {error}
        </div>
      )}

      {/* HEADER */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">
        <div className="flex items-start gap-4">
          <div className="bg-[#5B3DF5] text-white p-4 rounded-3xl text-3xl shadow-lg">
            <IoBarChart />
          </div>

          <div className="text-right">
            <h1 className="text-3xl md:text-4xl font-black text-zinc-800 dark:text-white">
              مركز التقارير
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm md:text-base">
              متابعة الأداء والتحليلات والإحصائيات الخاصة بالمبيعات
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button className="bg-[#5B3DF5] hover:bg-[#4c31d9] rounded-2xl px-6 h-12">
            الكل
          </Button>

          <Button
            variant="outline"
            className="rounded-2xl px-6 h-12 dark:border-zinc-700 dark:text-white dark:bg-zinc-900"
          >
            هذا الشهر
          </Button>

          <Button className="bg-black hover:bg-zinc-800 rounded-2xl px-6 h-12 text-white">
            تصدير PDF
          </Button>
        </div>
      </div>

      {/* CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {datas.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all text-right"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-green-500 font-bold text-sm">
                {item.price}
              </span>

              <div className="bg-[#F3F0FF] dark:bg-[#2a1e66] text-[#5B3DF5] p-4 rounded-2xl text-2xl">
                {item.icon}
              </div>
            </div>

            <p className="text-gray-500 dark:text-gray-400 mb-3">{item.name}</p>

            <h2 className="text-3xl font-black text-zinc-800 dark:text-white">
              {item.desc}
            </h2>
          </div>
        ))}
      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-10">
        {/* CATEGORIES */}

        <div className="bg-[#0B1020] rounded-3xl p-6 text-white">
          <h2 className="text-2xl font-black mb-8 text-right">
            أكثر التصنيفات طلبًا
          </h2>

          <div className="space-y-6">
            {categoriesData.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">{item.name}</span>

                  <span className="font-bold">{item.volume}%</span>
                </div>

                <div className="w-full h-3 bg-[#1B2238] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      index === 0
                        ? "bg-blue-500"
                        : index === 1
                          ? "bg-green-500"
                          : "bg-orange-400"
                    }`}
                    style={{
                      width: `${item.volume * 3}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHART */}

        <div className="xl:col-span-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          <div className="text-right">
            <h2 className="text-3xl font-black text-zinc-800 dark:text-white mb-2">
              الأداء الشهري
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mb-8">
              مقارنة الأرباح خلال الشهور الماضية
            </p>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="revenue" fill="#5B3DF5" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
