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
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
      }

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
    {
      icon: <FaDollarSign />,
      name: "إيراد الغسيل",
      desc: report?.summary?.laundryRevenue || 0,
      price: "+18%",
    },
    {
      icon: <FaHandHoldingDollar />,
      name: "إيراد التوصيل",
      desc: report?.summary?.deliveryRevenue || 0,
      price: "+10%",
    },
    {
      icon: <FaSackDollar />,
      name: "إيراد الصيانة",
      desc: report?.summary?.maintenanceRevenue || 0,
      price: "+7%",
    },
    {
      icon: <FaHandsWash />,
      name: "إيراد الخياطة",
      desc: report?.summary?.tailorRevenue || 0,
      price: "+15%",
    },
  ];

  // Monthly Chart Data

  const monthlyData =
    report?.charts?.monthly?.map((item) => ({
      month: item.month,
      orders: item.orders,
      revenue: Number(item.revenue),
    })) || [];

  // Categories Data

  const categoriesData =
    report?.charts?.categories?.map((item) => ({
      name: item.label,
      volume: item.volume,
      revenue: Number(item.revenue),
    })) || [];

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-2xl font-bold">Loading...</h2>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-red-500 text-2xl">{error}</h2>
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-[#5B3DF5] text-white p-4 rounded-2xl text-2xl">
            <IoBarChart />
          </div>

          <div>
            <h1 className="text-3xl font-black text-gray-800">
              مركز التقارير والتحليلات
            </h1>

            <p className="text-gray-500 mt-1">
              نظرة استراتيجية على أداء المبيعات والعملاء والعمليات
            </p>
          </div>
        </div>

        {/* Buttons */}

        <div className="flex flex-wrap gap-3">
          <Button className="bg-[#5B3DF5] hover:bg-[#4c31d9] rounded-xl px-6">
            الكل (طريقة الدفع)
          </Button>

          <Button
            variant="outline"
            className="rounded-xl px-6 border-[#5B3DF5] text-[#5B3DF5]"
          >
            كل الأوقات
          </Button>

          <Button className="bg-black hover:bg-gray-800 rounded-xl px-6">
            تصدير PDF
          </Button>
        </div>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {datas.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="bg-[#F3F0FF] text-[#5B3DF5] p-4 rounded-2xl text-2xl">
                {item.icon}
              </div>

              <span className="text-green-500 font-bold text-sm">
                {item.price}
              </span>
            </div>

            <h3 className="text-gray-500 text-sm mb-2">{item.name}</h3>

            <h1 className="text-3xl font-black text-gray-800">{item.desc}</h1>
          </div>
        ))}
      </div>

      {/* Charts Section */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
        {/* Categories */}

        <div className="bg-[#0B1020] text-white rounded-3xl p-6">
          <h2 className="text-2xl font-black mb-8">أكثر التصنيفات طلبًا</h2>

          <div className="space-y-6">
            {categoriesData.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">%{item.volume}</span>

                  <span className="text-sm text-gray-300">{item.name}</span>
                </div>

                <div className="w-full bg-[#1B2238] rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      index === 0
                        ? "bg-blue-500"
                        : index === 1
                          ? "bg-green-500"
                          : "bg-orange-400"
                    }`}
                    style={{
                      width: `${item.volume * 3}%,
                   `,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button className="mt-10 text-white font-bold hover:text-gray-300 transition">
            تقرير المبيعات التفصيلي
          </button>
        </div>

        {/* Monthly Chart */}

        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-3xl font-black text-gray-800 mb-2">
            منحنى الأداء الشهري
          </h2>

          <p className="text-gray-500 dark:text-gray-300 mb-8">
            مقارنة نسبة المبيعات خلال آخر الشهور الماضية
          </p>

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
