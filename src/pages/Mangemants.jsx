import React, { useEffect, useState } from "react";

import API from "@/api/axios";

import {
  ShoppingBag,
  Users,
  Wrench,
  Shirt,
  MapPin,
  Percent,
  Layers3,
  BadgePlus,
  Megaphone,
  ChevronLeft,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Clock3,
  CheckCircle2,
  Scissors,
  BadgeDollarSign,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const Mangemants = () => {
  // ================= STATES =================

  const [reports, setReports] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [paymentFilter, setPaymentFilter] = useState("all");

  const [timeFilter, setTimeFilter] = useState("all");

  // ================= FETCH REPORTS =================

  const getReports = async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/reports");

      setReports(res.data.data);
    } catch (err) {
      setError(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  // ================= DATA =================

  const summary = reports?.summary || {};

  const monthly = reports?.charts?.monthly || [];

  const categories = reports?.charts?.categories || [];

  // ================= SYSTEM BOXES =================

  const systemData = [
    {
      title: "مغاسل",
      count: 1,
      icon: Shirt,
      link: "/dashboard/laundry",
    },

    {
      title: "تصنيفات",
      count: 3,
      icon: Layers3,
      link: "/dashboard/price",
    },

    {
      title: "خدمات",
      count: 12,
      icon: ShoppingBag,
      link: "/dashboard/orders",
    },

    {
      title: "إضافات",
      count: 5,
      icon: BadgePlus,
      link: "/dashboard/earnings",
    },

    {
      title: "إعلانات",
      count: 2,
      icon: Megaphone,
      link: "/dashboard/reports",
    },

    {
      title: "الكوبونات",
      count: 4,
      icon: Percent,
      link: "/dashboard/copoun",
    },

    {
      title: "المناطق",
      count: 6,
      icon: MapPin,
      link: "/dashboard/areas",
    },
  ];

  // ================= STATS =================

  const cards = [
    {
      title: "إجمالي الإيرادات",
      value: summary?.totalRevenue || 0,
      icon: DollarSign,
      color: "bg-green-500/10 text-green-600",
    },

    {
      title: "إجمالي الطلبات",
      value: summary?.totalOrders || 0,
      icon: ShoppingCart,
      color: "bg-blue-500/10 text-blue-600",
    },

    {
      title: "الطلبات المعلقة",
      value: summary?.pendingOrders || 0,
      icon: Clock3,
      color: "bg-yellow-500/10 text-yellow-600",
    },

    {
      title: "الطلبات المكتملة",
      value: summary?.completedOrders || 0,
      icon: CheckCircle2,
      color: "bg-emerald-500/10 text-emerald-600",
    },

    {
      title: "طلبات الصيانة",
      value: summary?.totalMaintenanceRequests || 0,
      icon: Wrench,
      color: "bg-red-500/10 text-red-600",
    },

    {
      title: "طلبات الخياطة",
      value: summary?.totalTailorVisits || 0,
      icon: Scissors,
      color: "bg-purple-500/10 text-purple-600",
    },

    {
      title: "إجمالي العملاء",
      value: summary?.totalUsers || 0,
      icon: Users,
      color: "bg-cyan-500/10 text-cyan-600",
    },

    {
      title: "متوسط الطلب",
      value: summary?.avgOrderValue || 0,
      icon: BadgeDollarSign,
      color: "bg-orange-500/10 text-orange-600",
    },

    {
      title: "عملاء جدد",
      value: summary?.newCustomers || 0,
      icon: TrendingUp,
      color: "bg-pink-500/10 text-pink-600",
    },
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-zinc-950 min-h-screen transition-all">
      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-3xl bg-red-100 text-red-600 p-5 font-semibold">
          {error}
        </div>
      )}

      {/* HEADER */}

      <div className="bg-[#f8f9fc] dark:bg-zinc-900 rounded-[40px] p-8 mb-8 border border-gray-200 dark:border-zinc-800">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
          {/* LEFT */}

          <div className="flex items-center gap-4">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="
                h-14
                px-5
                rounded-2xl
                border
                border-gray-200
                dark:border-zinc-700
                bg-white
                dark:bg-zinc-950
                dark:text-white
                outline-none
              "
            >
              <option value="all">جميع الأوقات</option>

              <option value="today">اليوم</option>

              <option value="week">آخر أسبوع</option>

              <option value="month">آخر شهر</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="
                h-14
                px-5
                rounded-2xl
                border
                border-gray-200
                dark:border-zinc-700
                bg-white
                dark:bg-zinc-950
                dark:text-white
                outline-none
              "
            >
              <option value="all">طريقة الدفع</option>

              <option value="cash">كاش</option>

              <option value="visa">فيزا</option>
            </select>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-5">
            <div className="text-right">
              <h1 className="text-5xl font-black dark:text-white">
                لوحة التحكم
              </h1>

              <p className="text-gray-500 dark:text-zinc-400 mt-2 uppercase tracking-widest font-semibold">
                Dashboard & System Management
              </p>
            </div>

            <Button className="rounded-3xl w-20 h-20 bg-[#030b2f] hover:bg-[#030b2f]">
              <TrendingUp className="w-10 h-10 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="
                bg-white
                dark:bg-zinc-900
                border
                border-gray-200
                dark:border-zinc-800
                rounded-[30px]
                p-6
                shadow-sm
                hover:scale-[1.02]
                transition-all
              "
            >
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`
                    w-16
                    h-16
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    ${card.color}
                  `}
                >
                  <Icon className="w-8 h-8" />
                </div>

                <span className="text-gray-400 text-sm font-semibold">
                  LIVE
                </span>
              </div>

              <h3 className="text-gray-500 dark:text-gray-400 mb-2 font-semibold">
                {card.title}
              </h3>

              <h2 className="text-4xl font-black text-zinc-900 dark:text-white">
                {card.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* SYSTEM DATA */}

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[35px] p-6 md:p-8 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black dark:text-white">
              بيانات النظام
            </h2>

            <p className="text-gray-500 dark:text-zinc-400 mt-2">
              جميع أقسام لوحة التحكم
            </p>
          </div>

          <Link
            to="/dashboard/settings"
            className="
              flex
              items-center
              gap-2
              text-blue-600
              font-bold
            "
          >
            عرض الإعدادات
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* BOXES */}

        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
          {systemData.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                key={index}
                to={item.link}
                className="
                  bg-gray-50
                  dark:bg-zinc-950
                  border
                  border-gray-200
                  dark:border-zinc-800
                  rounded-[28px]
                  p-5
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                  hover:border-blue-500
                  hover:-translate-y-1
                  transition-all
                "
              >
                {/* ICON */}

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-blue-100
                    dark:bg-blue-500/10
                    flex
                    items-center
                    justify-center
                    mb-4
                  "
                >
                  <Icon className="w-7 h-7 text-blue-700 dark:text-blue-400" />
                </div>

                {/* NUMBER */}

                <h3 className="text-3xl font-black dark:text-white">
                  {item.count}
                </h3>

                {/* TITLE */}

                <p className="mt-2 text-sm font-bold text-gray-600 dark:text-zinc-400">
                  {item.title}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* MONTHLY */}

        <div
          className="
            xl:col-span-2
            bg-white
            dark:bg-zinc-900
            border
            border-gray-200
            dark:border-zinc-800
            rounded-[35px]
            p-6
            shadow-sm
          "
        >
          <div className="mb-8">
            <h2 className="text-3xl font-black dark:text-white">
              الإيرادات الشهرية
            </h2>

            <p className="text-gray-500 dark:text-zinc-400 mt-2">
              تحليل الطلبات والإيرادات الشهرية
            </p>
          </div>

          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <Tooltip />

                <Bar dataKey="revenue" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORY */}

        <div
          className="
            bg-white
            dark:bg-zinc-900
            border
            border-gray-200
            dark:border-zinc-800
            rounded-[35px]
            p-6
            shadow-sm
          "
        >
          <div className="mb-8">
            <h2 className="text-3xl font-black dark:text-white">
              الإيرادات حسب الفئة
            </h2>

            <p className="text-gray-500 dark:text-zinc-400 mt-2">
              عرض التقارير التفصيلية
            </p>
          </div>

          <div className="space-y-6">
            {categories.map((item, index) => {
              const total =
                categories.reduce(
                  (acc, curr) => acc + Number(curr.revenue),
                  0,
                ) || 1;

              const percent = ((Number(item.revenue) / total) * 100).toFixed(0);

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-black dark:text-white">
                        {item.label}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-zinc-400">
                        {item.revenue} ج
                      </p>
                    </div>

                    <span className="font-black text-blue-600">{percent}%</span>
                  </div>

                  <div className="w-full h-3 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${percent}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            to="/dashboard/reports"
            className="
              mt-8
              h-14
              rounded-2xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-bold
              flex
              items-center
              justify-center
              gap-2
              transition
            "
          >
            عرض التقارير التفصيلية
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* LOADING */}

      {loading && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div
            className="
              w-20
              h-20
              border-[6px]
              border-blue-500
              border-t-transparent
              rounded-full
              animate-spin
            "
          />
        </div>
      )}
    </div>
  );
};

export default Mangemants;
