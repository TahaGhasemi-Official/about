/* =========================================================
   TahaGhasemi — Music Archive Configuration
   static/js/music-data.js

   قواعد:
   1. هر اسلات کاملاً مستقل است.
   2. آهنگ فقط زمانی نمایش داده می‌شود که:
      - هر ۵ فیلد (name, tag, creator, disc, location) غیرخالی باشند.
      - فایل MP3 در مسیر مشخص‌شده واقعاً لود شود.
   3. اسلات ناقص نادیده گرفته می‌شود (نه کارت خالی، نه تکرار).
   4. مسیر فایل: "static/music/filename.mp3" (مطمئن شوید حروف بزرگ/کوچک رعایت شده).
   ========================================================= */

window.MUSIC_SLOTS = [
  // =======================================================
  // 1. آهنگ‌های موجود (پرشده)
  // =======================================================
  {
    name: "خرچنگ‌های مردابی",
    tag: "1",
    creator: "حبیب",
    disc: "چگونه رقص کند ماهی زلال‌پرست",
    location: "static/music/habib-kharchang.mp3"
  },
  {
    name: "هزاران",
    tag: "2",
    creator: "حبیب",
    disc: "یاران را چه شد؟",
    location: "static/music/habib-hezaran.mp3"
  },
  {
    name: "من همون درخت",
    tag: "3",
    creator: "ابی",
    disc: "من همون درخت",
    location: "static/music/ebi-derakht.mp3"
  },
  {
    name: "بوی گل‌های پونه",
    tag: "4",
    creator: "سیاوش قمیشی",
    disc: "بوی گل‌های پونه",
    location: "static/music/siavash-pooneh.mp3"
  },
  {
    name: "بی‌سرزمین‌تر از باد",
    tag: "5",
    creator: "سیاوش قمیشی",
    disc: "بی‌سرزمین‌تر از باد",
    location: "static/music/siavash-bisarzamin.mp3"
  },
  {
    name: "خدایا مرسی واسم ریختی دلار",
    tag: "6",
    creator: "ناشناس",
    disc: "خدایا مرسی واسم ریختی دلار",
    location: "static/music/hoda-merci-dl.mp3"
  },

  // =======================================================
  // 2. اسلات‌های خالی (آماده برای استفاده در آینده)
  // =======================================================
  // برای اضافه کردن آهنگ جدید، کافیست مقادیر زیر را پر کنید.
  // چون فیلدها خالی هستند، این کارت‌ها در سایت نمایش داده نمی‌شوند.
  
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 7
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 8
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 9
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 10
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 11
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 12
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 13
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 14
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 15
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 16
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 17
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 18
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 19
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 20
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 21
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 22
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 23
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 24
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 25
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 26
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 27
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 28
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 29
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 30
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 31
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 32
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 33
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 34
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 35
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 36
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 37
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 38
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 39
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 40
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 41
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 42
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 43
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 44
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 45
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 46
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 47
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 48
  { name: "", tag: "", creator: "", disc: "", location: "" }, // اسلات 49
  { name: "", tag: "", creator: "", disc: "", location: "" }  // اسلات 50
];