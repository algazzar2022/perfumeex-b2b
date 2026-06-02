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
    { id: "SA-EP", nameAr: "المنطقة الشرقية", nameEn: "Eastern Province" },
    { id: "SA-ASR", nameAr: "عسير", nameEn: "Asir" },
    { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }
  ],
  "AE": [
    { id: "AE-DU", nameAr: "دبي", nameEn: "Dubai" },
    { id: "AE-AD", nameAr: "أبوظبي", nameEn: "Abu Dhabi" },
    { id: "AE-SH", nameAr: "الشارقة", nameEn: "Sharjah" },
    { id: "AE-AJ", nameAr: "عجمان", nameEn: "Ajman" },
    { id: "AE-RAK", nameAr: "رأس الخيمة", nameEn: "Ras Al Khaimah" },
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
  // Egypt
  "EG-C": [{ id: "C-1", nameAr: "مدينة نصر", nameEn: "Nasr City" }, { id: "C-2", nameAr: "مصر الجديدة", nameEn: "Heliopolis" }, { id: "C-3", nameAr: "المعادي", nameEn: "Maadi" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-GZ": [{ id: "GZ-1", nameAr: "المهندسين", nameEn: "Mohandeseen" }, { id: "GZ-2", nameAr: "الهرم", nameEn: "Haram" }, { id: "GZ-3", nameAr: "6 أكتوبر", nameEn: "6th of October" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-ALX": [{ id: "ALX-1", nameAr: "سموحة", nameEn: "Smouha" }, { id: "ALX-2", nameAr: "سيدي بشر", nameEn: "Sidi Bishr" }, { id: "ALX-3", nameAr: "المنتزه", nameEn: "Montaza" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-DK": [{ id: "DK-1", nameAr: "المنصورة", nameEn: "Mansoura" }, { id: "DK-2", nameAr: "ميت غمر", nameEn: "Mit Ghamr" }, { id: "DK-3", nameAr: "طلخا", nameEn: "Talkha" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-SHR": [{ id: "SHR-1", nameAr: "الزقازيق", nameEn: "Zagazig" }, { id: "SHR-2", nameAr: "العاشر من رمضان", nameEn: "10th of Ramadan" }, { id: "SHR-3", nameAr: "بلبيس", nameEn: "Belbeis" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-MNF": [{ id: "MNF-1", nameAr: "شبين الكوم", nameEn: "Shibin El Kom" }, { id: "MNF-2", nameAr: "مدينة السادات", nameEn: "Sadat City" }, { id: "MNF-3", nameAr: "أشمون", nameEn: "Ashmoun" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-KB": [{ id: "KB-1", nameAr: "بنها", nameEn: "Benha" }, { id: "KB-2", nameAr: "شبرا الخيمة", nameEn: "Shubra El Kheima" }, { id: "KB-3", nameAr: "قليوب", nameEn: "Qalyub" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-BH": [{ id: "BH-1", nameAr: "دمنهور", nameEn: "Damanhour" }, { id: "BH-2", nameAr: "كفر الدوار", nameEn: "Kafr El Dawwar" }, { id: "BH-3", nameAr: "رشيد", nameEn: "Rashid" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-GH": [{ id: "GH-1", nameAr: "طنطا", nameEn: "Tanta" }, { id: "GH-2", nameAr: "المحلة الكبرى", nameEn: "El Mahalla El Kubra" }, { id: "GH-3", nameAr: "زفتى", nameEn: "Zifta" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-PS": [{ id: "PS-1", nameAr: "بورسعيد", nameEn: "Port Said" }, { id: "PS-2", nameAr: "بورفؤاد", nameEn: "Port Fouad" }, { id: "PS-3", nameAr: "الزهور", nameEn: "Al Zohour" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-IS": [{ id: "IS-1", nameAr: "الإسماعيلية", nameEn: "Ismailia" }, { id: "IS-2", nameAr: "فايد", nameEn: "Fayed" }, { id: "IS-3", nameAr: "القنطرة", nameEn: "El Qantara" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-SUZ": [{ id: "SUZ-1", nameAr: "السويس", nameEn: "Suez" }, { id: "SUZ-2", nameAr: "عتاقة", nameEn: "Ataqah" }, { id: "SUZ-3", nameAr: "الأربعين", nameEn: "Arbaeen" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-KFS": [{ id: "KFS-1", nameAr: "كفر الشيخ", nameEn: "Kafr El Sheikh" }, { id: "KFS-2", nameAr: "دسوق", nameEn: "Desouk" }, { id: "KFS-3", nameAr: "بلطيم", nameEn: "Baltim" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-FYM": [{ id: "FYM-1", nameAr: "الفيوم", nameEn: "Fayoum" }, { id: "FYM-2", nameAr: "سنورس", nameEn: "Senoures" }, { id: "FYM-3", nameAr: "إبشواي", nameEn: "Ibshaway" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-BNS": [{ id: "BNS-1", nameAr: "بني سويف", nameEn: "Beni Suef" }, { id: "BNS-2", nameAr: "ببا", nameEn: "Biba" }, { id: "BNS-3", nameAr: "الواسطى", nameEn: "Al Wasta" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-MN": [{ id: "MN-1", nameAr: "المنيا", nameEn: "Minya" }, { id: "MN-2", nameAr: "ملوي", nameEn: "Mallawi" }, { id: "MN-3", nameAr: "مغاغة", nameEn: "Maghagha" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-AST": [{ id: "AST-1", nameAr: "أسيوط", nameEn: "Assiut" }, { id: "AST-2", nameAr: "ديروط", nameEn: "Dairut" }, { id: "AST-3", nameAr: "منفلوط", nameEn: "Manfalut" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-SHG": [{ id: "SHG-1", nameAr: "سوهاج", nameEn: "Sohag" }, { id: "SHG-2", nameAr: "أخميم", nameEn: "Akhmim" }, { id: "SHG-3", nameAr: "طهطا", nameEn: "Tahta" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-QNA": [{ id: "QNA-1", nameAr: "قنا", nameEn: "Qena" }, { id: "QNA-2", nameAr: "نجع حمادي", nameEn: "Nagaa Hammadi" }, { id: "QNA-3", nameAr: "قوص", nameEn: "Qus" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-LXR": [{ id: "LXR-1", nameAr: "الأقصر", nameEn: "Luxor" }, { id: "LXR-2", nameAr: "إسنا", nameEn: "Esna" }, { id: "LXR-3", nameAr: "أرمنت", nameEn: "Armant" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-ASW": [{ id: "ASW-1", nameAr: "أسوان", nameEn: "Aswan" }, { id: "ASW-2", nameAr: "إدفو", nameEn: "Edfu" }, { id: "ASW-3", nameAr: "كوم أمبو", nameEn: "Kom Ombo" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-RS": [{ id: "RS-1", nameAr: "الغردقة", nameEn: "Hurghada" }, { id: "RS-2", nameAr: "سفاجا", nameEn: "Safaga" }, { id: "RS-3", nameAr: "مرسى علم", nameEn: "Marsa Alam" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-MT": [{ id: "MT-1", nameAr: "مرسى مطروح", nameEn: "Marsa Matrouh" }, { id: "MT-2", nameAr: "العلمين", nameEn: "El Alamein" }, { id: "MT-3", nameAr: "سيوة", nameEn: "Siwa" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-WAD": [{ id: "WAD-1", nameAr: "الخارجة", nameEn: "Kharga" }, { id: "WAD-2", nameAr: "الداخلة", nameEn: "Dakhla" }, { id: "WAD-3", nameAr: "الفرافرة", nameEn: "Farafra" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-NSIN": [{ id: "NSIN-1", nameAr: "العريش", nameEn: "Arish" }, { id: "NSIN-2", nameAr: "الشيخ زويد", nameEn: "Sheikh Zuweid" }, { id: "NSIN-3", nameAr: "رفح", nameEn: "Rafah" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "EG-SSIN": [{ id: "SSIN-1", nameAr: "شرم الشيخ", nameEn: "Sharm El Sheikh" }, { id: "SSIN-2", nameAr: "دهب", nameEn: "Dahab" }, { id: "SSIN-3", nameAr: "نويبع", nameEn: "Nuweiba" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  
  // Saudi
  "SA-RIY": [{ id: "RIY-1", nameAr: "الرياض", nameEn: "Riyadh" }, { id: "RIY-2", nameAr: "الخرج", nameEn: "Al Kharj" }, { id: "RIY-3", nameAr: "الدرعية", nameEn: "Diriyah" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "SA-MAK": [{ id: "MAK-1", nameAr: "مكة المكرمة", nameEn: "Makkah" }, { id: "MAK-2", nameAr: "جدة", nameEn: "Jeddah" }, { id: "MAK-3", nameAr: "الطائف", nameEn: "Taif" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "SA-MED": [{ id: "MED-1", nameAr: "المدينة المنورة", nameEn: "Madinah" }, { id: "MED-2", nameAr: "ينبع", nameEn: "Yanbu" }, { id: "MED-3", nameAr: "العلا", nameEn: "AlUla" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "SA-EP": [{ id: "EP-1", nameAr: "الدمام", nameEn: "Dammam" }, { id: "EP-2", nameAr: "الخبر", nameEn: "Al Khobar" }, { id: "EP-3", nameAr: "الجبيل", nameEn: "Jubail" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "SA-ASR": [{ id: "ASR-1", nameAr: "أبها", nameEn: "Abha" }, { id: "ASR-2", nameAr: "خميس مشيط", nameEn: "Khamis Mushait" }, { id: "ASR-3", nameAr: "بيشة", nameEn: "Bisha" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  
  // UAE
  "AE-DU": [{ id: "DU-1", nameAr: "دبي", nameEn: "Dubai" }, { id: "DU-2", nameAr: "جبل علي", nameEn: "Jebel Ali" }, { id: "DU-3", nameAr: "حتا", nameEn: "Hatta" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "AE-AD": [{ id: "AD-1", nameAr: "أبوظبي", nameEn: "Abu Dhabi" }, { id: "AD-2", nameAr: "العين", nameEn: "Al Ain" }, { id: "AD-3", nameAr: "الظفرة", nameEn: "Al Dhafra" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "AE-SH": [{ id: "SH-1", nameAr: "الشارقة", nameEn: "Sharjah" }, { id: "SH-2", nameAr: "خورفكان", nameEn: "Khor Fakkan" }, { id: "SH-3", nameAr: "كلباء", nameEn: "Kalba" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "AE-AJ": [{ id: "AJ-1", nameAr: "عجمان", nameEn: "Ajman" }, { id: "AJ-2", nameAr: "مصفوت", nameEn: "Masfout" }, { id: "AJ-3", nameAr: "المنامة", nameEn: "Al Manama" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "AE-RAK": [{ id: "RAK-1", nameAr: "رأس الخيمة", nameEn: "Ras Al Khaimah" }, { id: "RAK-2", nameAr: "الجزيرة الحمراء", nameEn: "Al Jazirah Al Hamra" }, { id: "RAK-3", nameAr: "الدقداقة", nameEn: "Digdaga" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  
  // Libya
  "LY-TR": [{ id: "TR-1", nameAr: "طرابلس", nameEn: "Tripoli" }, { id: "TR-2", nameAr: "تاجوراء", nameEn: "Tajoura" }, { id: "TR-3", nameAr: "سوق الجمعة", nameEn: "Souq al Jumaa" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "LY-BN": [{ id: "BN-1", nameAr: "بنغازي", nameEn: "Benghazi" }, { id: "BN-2", nameAr: "سلوق", nameEn: "Suluq" }, { id: "BN-3", nameAr: "قمينس", nameEn: "Qaminis" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }],
  "LY-MS": [{ id: "MS-1", nameAr: "مصراتة", nameEn: "Misrata" }, { id: "MS-2", nameAr: "زليتن", nameEn: "Zliten" }, { id: "MS-3", nameAr: "الخمس", nameEn: "Al Khums" }, { id: "OTHER", nameAr: "أخرى", nameEn: "Other" }]
};
