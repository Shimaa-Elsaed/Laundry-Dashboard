import React, { useEffect, useState } from "react";
import API from "@/api/axios";

import {
  Shield,
  Globe,
  Phone,
  Mail,
  DollarSign,
  Save,
  RefreshCcw,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const Settings = () => {
  // ================= STATES =================

  const [settings, setSettings] = useState([]);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    platformNameAr: "",
    platformNameEn: "",
    whatsapp: "",
    email: "",
    minOrder: "",
    serviceFee: "",
    language: "العربية",
    currency: "جنيه مصري (EGP)",
    timezone: "توقيت مكة والرياض (+3 GMT)",
    vip: true,
    coupons: true,
    locationRequired: true,
  });

  // ================= FETCH SETTINGS =================

  const fetchSettings = async () => {
    try {
      setLoading(true);

      setError("");

      const res = await API.get("/admin/settings");

      const data = res.data.data;

      setSettings(data);

      const supportPhone =
        data.find((item) => item.SettingKey === "SupportPhone")?.SettingValue ||
        "";

      const minOrder =
        data.find((item) => item.SettingKey === "MinOrderAmount")
          ?.SettingValue || "";

      const commission =
        data.find((item) => item.SettingKey === "CommissionRate")
          ?.SettingValue || "";

      const email =
        data.find((item) => item.SettingKey === "SupportEmail")?.SettingValue ||
        "";

      const platformAr =
        data.find((item) => item.SettingKey === "PlatformNameAr")
          ?.SettingValue || "";

      const platformEn =
        data.find((item) => item.SettingKey === "PlatformNameEn")
          ?.SettingValue || "";

      setFormData((prev) => ({
        ...prev,
        whatsapp: supportPhone,
        minOrder: minOrder,
        serviceFee: commission,
        email: email,
        platformNameAr: platformAr,
        platformNameEn: platformEn,
      }));
    } catch (err) {
      console.log(err);

      setError("فشل تحميل الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ================= UPDATE SETTING =================

  const updateSetting = async (id, value) => {
    try {
      await API.patch(`/admin/settings/${id}`, {
        value,
      });
    } catch (error) {
      console.log(error);

      throw error;
    }
  };

  // ================= SAVE =================

  const handleSave = async () => {
    try {
      setSaving(true);

      setError("");

      setSuccess("");

      const phoneSetting = settings.find(
        (item) => item.SettingKey === "SupportPhone",
      );

      const minOrderSetting = settings.find(
        (item) => item.SettingKey === "MinOrderAmount",
      );

      const commissionSetting = settings.find(
        (item) => item.SettingKey === "CommissionRate",
      );

      const emailSetting = settings.find(
        (item) => item.SettingKey === "SupportEmail",
      );

      const platformArSetting = settings.find(
        (item) => item.SettingKey === "PlatformNameAr",
      );

      const platformEnSetting = settings.find(
        (item) => item.SettingKey === "PlatformNameEn",
      );

      if (phoneSetting) {
        await updateSetting(phoneSetting.SettingID, formData.whatsapp);
      }

      if (minOrderSetting) {
        await updateSetting(minOrderSetting.SettingID, formData.minOrder);
      }

      if (commissionSetting) {
        await updateSetting(commissionSetting.SettingID, formData.serviceFee);
      }

      if (emailSetting) {
        await updateSetting(emailSetting.SettingID, formData.email);
      }

      if (platformArSetting) {
        await updateSetting(
          platformArSetting.SettingID,
          formData.platformNameAr,
        );
      }

      if (platformEnSetting) {
        await updateSetting(
          platformEnSetting.SettingID,
          formData.platformNameEn,
        );
      }

      setSuccess("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      console.log(error);

      setError("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setSaving(false);

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    }
  };

  // ================= COLORS =================

  const bg = "bg-[#f4f7fb] dark:bg-[#0b1120] text-[#0f172a] dark:text-white";

  const card =
    "bg-white dark:bg-[#131c31] border border-[#e2e8f0] dark:border-[#1e293b] shadow-sm";

  const input =
    "bg-[#f8fafc] dark:bg-[#0f172a] border border-[#dbe4f0] dark:border-[#25324a] text-[#0f172a] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500";

  const title = "text-[#0f172a] dark:text-white font-extrabold tracking-tight";

  const subTitle = "text-[#64748b] dark:text-[#94a3b8]";

  const primaryBtn =
    "bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white";

  const toggleActive = "bg-[#2563eb]";

  const toggleInactive = "bg-gray-300 dark:bg-[#334155]";

  return (
    <div dir="rtl" className={`min-h-screen transition-all duration-300 ${bg}`}>
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* ================= HEADER ================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          <div>
            <h1 className={`text-3xl md:text-5xl mb-2 ${title}`}>
              إعدادات المنصة
            </h1>

            <p className={`text-sm md:text-base ${subTitle}`}>
              التحكم الكامل في إعدادات النظام والتواصل
            </p>
          </div>

          <button
            onClick={fetchSettings}
            disabled={loading}
            className={`px-5 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2 ${primaryBtn}`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <RefreshCcw size={18} />
            )}

            {loading ? "جاري التحديث..." : "تحديث البيانات"}
          </button>
        </div>

        {/* ================= ALERTS ================= */}

        {error && (
          <div className="mb-6 bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle size={20} />

            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 size={20} />

            <span>{success}</span>
          </div>
        )}

        {/* ================= CONTENT ================= */}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ================= RULES ================= */}

          <div
            className={`rounded-[30px] p-6 transition-all duration-300 ${card}`}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Shield className="text-blue-600 dark:text-blue-400" />
              </div>

              <div>
                <h2 className={`text-2xl ${title}`}>إعدادات التشغيل</h2>

                <p className={subTitle}>التحكم في خصائص المنصة</p>
              </div>
            </div>

            <div className="space-y-7">
              {/* VIP */}

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg dark:text-white">
                    خدمة VIP
                  </h3>

                  <p className={subTitle}>التوصيل خلال ساعتين</p>
                </div>

                <button
                  onClick={() =>
                    setFormData({
                      ...formData,
                      vip: !formData.vip,
                    })
                  }
                  className={`w-14 h-7 rounded-full transition-all duration-300 ${
                    formData.vip ? toggleActive : toggleInactive
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full transition-all duration-300 ${
                      formData.vip ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* COUPONS */}

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg dark:text-white">
                    الكوبونات
                  </h3>

                  <p className={subTitle}>تفعيل أكواد الخصم</p>
                </div>

                <button
                  onClick={() =>
                    setFormData({
                      ...formData,
                      coupons: !formData.coupons,
                    })
                  }
                  className={`w-14 h-7 rounded-full transition-all duration-300 ${
                    formData.coupons ? toggleActive : toggleInactive
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full transition-all duration-300 ${
                      formData.coupons ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* LOCATION */}

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg dark:text-white">
                    تحديد الموقع
                  </h3>

                  <p className={subTitle}>إلزام العميل باللوكيشن</p>
                </div>

                <button
                  onClick={() =>
                    setFormData({
                      ...formData,
                      locationRequired: !formData.locationRequired,
                    })
                  }
                  className={`w-14 h-7 rounded-full transition-all duration-300 ${
                    formData.locationRequired ? toggleActive : toggleInactive
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full transition-all duration-300 ${
                      formData.locationRequired
                        ? "translate-x-7"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ================= FORM ================= */}

          <div
            className={`lg:col-span-2 rounded-[30px] p-6 transition-all duration-300 ${card}`}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Globe className="text-blue-600 dark:text-blue-400" />
              </div>

              <div>
                <h2 className={`text-2xl ${title}`}>معلومات المنصة</h2>

                <p className={subTitle}>إعدادات التواصل والعمولات</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* PLATFORM AR */}

              <div>
                <label className="mb-2 block font-semibold">
                  اسم المنصة عربي
                </label>

                <input
                  type="text"
                  value={formData.platformNameAr}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platformNameAr: e.target.value,
                    })
                  }
                  className={`w-full p-4 rounded-2xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${input}`}
                />
              </div>

              {/* PLATFORM EN */}

              <div>
                <label className="mb-2 block font-semibold">
                  Platform Name
                </label>

                <input
                  type="text"
                  value={formData.platformNameEn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platformNameEn: e.target.value,
                    })
                  }
                  className={`w-full p-4 rounded-2xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${input}`}
                />
              </div>

              {/* WHATSAPP */}

              <div>
                <label className="mb-2 block font-semibold">رقم الواتساب</label>

                <div className="relative">
                  <Phone
                    className="absolute top-4 right-4 text-gray-400"
                    size={18}
                  />

                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whatsapp: e.target.value,
                      })
                    }
                    className={`w-full p-4 pr-11 rounded-2xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${input}`}
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block font-semibold">
                  البريد الإلكتروني
                </label>

                <div className="relative">
                  <Mail
                    className="absolute top-4 right-4 text-gray-400"
                    size={18}
                  />

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className={`w-full p-4 pr-11 rounded-2xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${input}`}
                  />
                </div>
              </div>

              {/* MIN ORDER */}

              <div>
                <label className="mb-2 block font-semibold">
                  الحد الأدنى للطلب
                </label>

                <input
                  type="number"
                  value={formData.minOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minOrder: e.target.value,
                    })
                  }
                  className={`w-full p-4 rounded-2xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${input}`}
                />
              </div>

              {/* SERVICE FEE */}

              <div>
                <label className="mb-2 block font-semibold">
                  رسوم الخدمة %
                </label>

                <div className="relative">
                  <DollarSign
                    className="absolute top-4 right-4 text-gray-400"
                    size={18}
                  />

                  <input
                    type="number"
                    value={formData.serviceFee}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        serviceFee: e.target.value,
                      })
                    }
                    className={`w-full p-4 pr-11 rounded-2xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${input}`}
                  />
                </div>
              </div>

              {/* CURRENCY */}

              <div>
                <label className="mb-2 block font-semibold">العملة</label>

                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currency: e.target.value,
                    })
                  }
                  className={`w-full p-4 rounded-2xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${input}`}
                >
                  <option>جنيه مصري (EGP)</option>

                  <option>ريال سعودي (SAR)</option>

                  <option>دولار أمريكي (USD)</option>
                </select>
              </div>

              {/* LANGUAGE */}

              <div>
                <label className="mb-2 block font-semibold">لغة النظام</label>

                <select
                  value={formData.language}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      language: e.target.value,
                    })
                  }
                  className={`w-full p-4 rounded-2xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${input}`}
                >
                  <option>العربية</option>

                  <option>English</option>
                </select>
              </div>

              {/* TIMEZONE */}

              <div className="md:col-span-2">
                <label className="mb-2 block font-semibold">
                  النطاق الزمني
                </label>

                <select
                  value={formData.timezone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      timezone: e.target.value,
                    })
                  }
                  className={`w-full p-4 rounded-2xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${input}`}
                >
                  <option>توقيت مكة والرياض (+3 GMT)</option>

                  <option>توقيت القاهرة (+2 GMT)</option>

                  <option>توقيت الإمارات (+4 GMT)</option>
                </select>
              </div>
            </div>

            {/* SAVE BUTTON */}

            <div className="mt-10 flex justify-center">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-10 py-4 rounded-2xl text-lg font-bold flex items-center gap-3 transition-all duration-300 ${primaryBtn}`}
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}

                {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
