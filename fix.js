const fs = require('fs');
const files = [
  'l:/PERFUMEEX/main-website/src/app/[locale]/companies/preview/page.tsx',
  'l:/PERFUMEEX/main-website/src/app/api/company/branches/[id]/route.ts',
  'l:/PERFUMEEX/main-website/src/app/api/company/branches/route.ts',
  'l:/PERFUMEEX/main-website/src/app/api/company/gallery/[id]/route.ts',
  'l:/PERFUMEEX/main-website/src/app/api/company/gallery/route.ts',
  'l:/PERFUMEEX/main-website/src/app/api/company/products/[id]/route.ts',
  'l:/PERFUMEEX/main-website/src/app/api/company/products/route.ts',
  'l:/PERFUMEEX/main-website/src/app/api/company/profile/route.ts',
  'l:/PERFUMEEX/main-website/src/app/api/messages/route.ts'
];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/import\s+\{\s*authOptions\s*\}\s+from\s+[\"'](?:\.\.\/)+auth\/\[\.\.\.nextauth\]\/route[\"'];?/g, 'import { authOptions } from "@/lib/auth";');
    content = content.replace(/import\s+\{\s*authOptions\s*\}\s+from\s+[\"']@\/app\/api\/auth\/\[\.\.\.nextauth\]\/route[\"'];?/g, 'import { authOptions } from "@/lib/auth";');
    fs.writeFileSync(f, content);
    console.log('Updated', f);
  } else {
    console.log('Not found', f);
  }
});
