export const ARAB_COUNTRIES = [
  { id: "EG", nameAr: "مصر", nameEn: "Egypt" },
  { id: "SA", nameAr: "السعودية", nameEn: "Saudi Arabia" },
  { id: "AE", nameAr: "الإمارات", nameEn: "UAE" },
  { id: "LY", nameAr: "ليبيا", nameEn: "Libya" },
  { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }
];

export const GOVERNORATES: Record<string, { id: string; nameAr: string; nameEn: string }[]> = {
  "EG": [
    { id: "EG-C", nameAr: "القاهرة", nameEn: "Cairo" },
    { id: "EG-GZ", nameAr: "الجيزة", nameEn: "Giza" },
    { id: "EG-ALX", nameAr: "الإسكندرية", nameEn: "Alexandria" },
    { id: "EG-DK", nameAr: "الدقهلية", nameEn: "Dakahlia" },
    { id: "EG-SHR", nameAr: "الشرقية", nameEn: "Al Sharqia" },
    { id: "EG-MNF", nameAr: "المنوفية", nameEn: "Monufia" },
    { id: "EG-KB", nameAr: "القليوبية", nameEn: "Qalyubia" },
    { id: "EG-BH", nameAr: "البحيرة", nameEn: "Beheira" },
    { id: "EG-GH", nameAr: "الغربية", nameEn: "Gharbia" },
    { id: "EG-PS", nameAr: "بورسعيد", nameEn: "Port Said" },
    { id: "EG-IS", nameAr: "الإسماعيلية", nameEn: "Ismailia" },
    { id: "EG-SUZ", nameAr: "السويس", nameEn: "Suez" },
    { id: "EG-KFS", nameAr: "كفر الشيخ", nameEn: "Kafr El Sheikh" },
    { id: "EG-FYM", nameAr: "الفيوم", nameEn: "Fayoum" },
    { id: "EG-BNS", nameAr: "بني سويف", nameEn: "Beni Suef" },
    { id: "EG-MN", nameAr: "المنيا", nameEn: "Minya" },
    { id: "EG-AST", nameAr: "أسيوط", nameEn: "Assiut" },
    { id: "EG-SHG", nameAr: "سوهاج", nameEn: "Sohag" },
    { id: "EG-QNA", nameAr: "قنا", nameEn: "Qena" },
    { id: "EG-LXR", nameAr: "الأقصر", nameEn: "Luxor" },
    { id: "EG-ASW", nameAr: "أسوان", nameEn: "Aswan" },
    { id: "EG-RS", nameAr: "البحر الأحمر", nameEn: "Red Sea" },
    { id: "EG-MT", nameAr: "مطروح", nameEn: "Matrouh" },
    { id: "EG-WAD", nameAr: "الوادي الجديد", nameEn: "New Valley" },
    { id: "EG-NSIN", nameAr: "شمال سيناء", nameEn: "North Sinai" },
    { id: "EG-SSIN", nameAr: "جنوب سيناء", nameEn: "South Sinai" },
    { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }
  ],
  "SA": [
    { id: "SA-RIY", nameAr: "الرياض", nameEn: "Riyadh" },
    { id: "SA-MAK", nameAr: "مكة المكرمة", nameEn: "Makkah" },
    { id: "SA-MED", nameAr: "المدينة المنورة", nameEn: "Madinah" },
    { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }
  ],
  "AE": [
    { id: "AE-DU", nameAr: "دبي", nameEn: "Dubai" },
    { id: "AE-AD", nameAr: "أبوظبي", nameEn: "Abu Dhabi" },
    { id: "AE-SH", nameAr: "الشارقة", nameEn: "Sharjah" },
    { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }
  ],
  "LY": [
    { id: "LY-TR", nameAr: "طرابلس", nameEn: "Tripoli" },
    { id: "LY-BN", nameAr: "بنغازي", nameEn: "Benghazi" },
    { id: "LY-MS", nameAr: "مصراتة", nameEn: "Misrata" },
    { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }
  ]
};

export const CITIES: Record<string, { id: string; nameAr: string; nameEn: string }[]> = {
  // Egypt - Cairo
  "EG-C": [
    { id: "C-1", nameAr: "مدينة نصر", nameEn: "Nasr City" },
    { id: "C-2", nameAr: "مصر الجديدة", nameEn: "Heliopolis" },
    { id: "C-3", nameAr: "المعادي", nameEn: "Maadi" },
    { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }
  ],
  // Egypt - Giza
  "EG-GZ": [
    { id: "GZ-1", nameAr: "المهندسين", nameEn: "Mohandeseen" },
    { id: "GZ-2", nameAr: "الهرم", nameEn: "Haram" },
    { id: "GZ-3", nameAr: "6 أكتوبر", nameEn: "6th of October" },
    { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }
  ],
  // Egypt - Alexandria
  "EG-ALX": [
    { id: "ALX-1", nameAr: "سموحة", nameEn: "Smouha" },
    { id: "ALX-2", nameAr: "سيدي بشر", nameEn: "Sidi Bishr" },
    { id: "ALX-3", nameAr: "المنتزه", nameEn: "Montaza" },
    { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }
  ],
  // Saudi - Riyadh
  "SA-RIY": [
    { id: "RIY-1", nameAr: "الرياض", nameEn: "Riyadh" },
    { id: "RIY-2", nameAr: "الخرج", nameEn: "Al Kharj" },
    { id: "RIY-3", nameAr: "الدرعية", nameEn: "Diriyah" },
    { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }
  ],
  // Saudi - Makkah
  "SA-MAK": [
    { id: "MAK-1", nameAr: "مكة المكرمة", nameEn: "Makkah" },
    { id: "MAK-2", nameAr: "جدة", nameEn: "Jeddah" },
    { id: "MAK-3", nameAr: "الطائف", nameEn: "Taif" },
    { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }
  ],
  // UAE - Dubai
  "AE-DU": [
    { id: "DU-1", nameAr: "دبي", nameEn: "Dubai" },
    { id: "DU-2", nameAr: "جبل علي", nameEn: "Jebel Ali" },
    { id: "DU-3", nameAr: "ديرة", nameEn: "Deira" },
    { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }
  ],
  // Libya - Tripoli
  "LY-TR": [
    { id: "TR-1", nameAr: "طرابلس", nameEn: "Tripoli" },
    { id: "TR-2", nameAr: "تاجوراء", nameEn: "Tajoura" },
    { id: "TR-3", nameAr: "سوق الجمعة", nameEn: "Souq al Jumaa" },
    { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }
  ]
};
