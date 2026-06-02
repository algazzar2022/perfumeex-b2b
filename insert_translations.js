const fs = require('fs');

const arPath = './src/messages/ar.json';
const enPath = './src/messages/en.json';

const arObj = JSON.parse(fs.readFileSync(arPath, 'utf8'));
arObj['CompaniesDirectory'] = {
  "title": "استكشف الشركات",
  "subtitle": "تصفح آلاف مصنعي العطور والموردين وشركات التعبئة والتغليف الموثوقة حول العالم.",
  "searchPlaceholder": "ابحث عن الشركات بالاسم أو الكلمات المفتاحية...",
  "filters": "تصفية",
  "verified": "شركة موثقة",
  "viewProfile": "عرض التفاصيل",
  "noCompanies": "لم يتم العثور على شركات تطابق بحثك."
};
fs.writeFileSync(arPath, JSON.stringify(arObj, null, 2));

const enObj = JSON.parse(fs.readFileSync(enPath, 'utf8'));
enObj['CompaniesDirectory'] = {
  "title": "Discover Companies",
  "subtitle": "Browse through thousands of verified perfume manufacturers, suppliers, and packaging companies worldwide.",
  "searchPlaceholder": "Search companies by name or keyword...",
  "filters": "Filters",
  "verified": "Verified Supplier",
  "viewProfile": "View Profile",
  "noCompanies": "No companies found matching your search."
};
fs.writeFileSync(enPath, JSON.stringify(enObj, null, 2));

console.log('Done!');
