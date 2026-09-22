const fs = require('fs');

const files = [
  'apps/web/src/app/college/page.tsx',
  'apps/web/src/app/industry/dashboard/page.tsx',
  'apps/web/src/app/government/page.tsx',
  'apps/web/src/app/admin/page.tsx',
  'apps/web/src/app/college/login/page.tsx',
  'apps/web/src/app/industry/login/page.tsx',
  'apps/web/src/app/admin/login/page.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`Skipping ${file}`);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');

  // Replace text-white with dynamic class where it's a simple double-quote className
  content = content.replace(/className="([^"]*\btext-white\b[^"]*)"/g, (match, p1) => {
    let newClass = p1.replace(/\btext-white\b/g, '');
    return 'className={`' + newClass.trim() + ' ${isDark ? "text-white" : "text-slate-900"}`}';
  });

  // Replace text-slate-400 where it's a simple double-quote className
  content = content.replace(/className="([^"]*\btext-slate-400\b[^"]*)"/g, (match, p1) => {
    if (p1.includes('${isDark')) return match; // avoid nesting
    let newClass = p1.replace(/\btext-slate-400\b/g, '');
    return 'className={`' + newClass.trim() + ' ${isDark ? "text-slate-400" : "text-slate-600"}`}';
  });

  // Replace bg-slate-950 and bg-slate-900 in simple double-quote className
  content = content.replace(/className="([^"]*\bbg-slate-9[05]0\b[^"]*)"/g, (match, p1) => {
    if (p1.includes('${isDark')) return match;
    let newClass = p1.replace(/\bbg-slate-950\b/g, '').replace(/\bbg-slate-900\b/g, '');
    return 'className={`' + newClass.trim() + ' ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}';
  });

  // Sometimes they are inside template literals: className={`... text-white ...`}
  content = content.replace(/(\btext-white\b)(?![^`]*`\})([^`]*`\})/g, '${isDark ? "text-white" : "text-slate-900"}$2');
  content = content.replace(/(\btext-slate-400\b)(?![^`]*`\})([^`]*`\})/g, '${isDark ? "text-slate-400" : "text-slate-600"}$2');
  content = content.replace(/(\bbg-slate-900\b)(?![^`]*`\})([^`]*`\})/g, '${isDark ? "bg-slate-900" : "bg-white"}');
  content = content.replace(/(\bbg-slate-950\b)(?![^`]*`\})([^`]*`\})/g, '${isDark ? "bg-slate-950" : "bg-slate-50"}');

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
