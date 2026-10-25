/* =========================================================
   TahaGhasemi — Links Directory Configuration
   static/js/links-data.js

   قواعد:
   - هر آیتم باید دارای title، url معتبر (http/https) و description باشد.
   - icon اختیاری است (کلید آیکون: instagram | telegram | bale | website | github | project | resource | default)
   - category اختیاری است (مثلاً "social", "project", "resource")
   - آیتم بدون url معتبر نمایش داده نمی‌شود.
   ========================================================= */

window.LINKS_ITEMS = [
  // --- شبکه‌های اجتماعی ---
  {
    title: { fa: "اینستاگرام", en: "Instagram" },
    description: {
      fa: "پروفایل عمومی من در اینستاگرام",
      en: "My public Instagram profile"
    },
    url: "https://www.instagram.com/tahaghasemi_neo/",
    icon: "instagram",
    category: "social"
  },
  {
    title: { fa: "تلگرام", en: "Telegram" },
    description: {
      fa: "ارتباط مستقیم و دنبال کردن به‌روزرسانی‌ها",
      en: "Direct contact and following updates"
    },
    url: "https://t.me/TG_TahaGhasemi",
    icon: "telegram",
    category: "social"
  },

  // --- پروژه‌ها ---
  {
    title: { fa: "Lilo", en: "Lilo" },
    description: {
      fa: "اپلیکیشن وب صنعتی و فروشگاه آنلاین — پروژه شاخص من",
      en: "Industrial web application and online shop — my featured project"
    },
    url: "https://lilogroup.ir",
    icon: "project",
    category: "project"
  }
];