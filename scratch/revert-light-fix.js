const fs = require('fs');

const files = [
  'apps/web/src/app/college/page.tsx',
  'apps/web/src/app/industry/dashboard/page.tsx',
  'apps/web/src/app/government/page.tsx',
  'apps/web/src/app/admin/page.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Revert the bad replacements
  content = content.replace(/\$\{isDark \? "(text-white)" : "text-gray-900"\}/g, '$1');
  content = content.replace(/\$\{isDark \? "(text-[a-z]+-[23]00)" : "text-[a-z]+-700"\}/g, '$1');
  content = content.replace(/\$\{isDark \? "(text-(?:slate|zinc)-400)" : "text-gray-600"\}/g, '$1');
  content = content.replace(/\$\{isDark \? "(bg-(?:slate|zinc)-900)" : "bg-white shadow-sm border border-gray-200"\}/g, '$1');
  content = content.replace(/\$\{isDark \? "(bg-(?:slate|zinc)-950)" : "bg-gray-50"\}/g, '$1');
  
  // Revert the double-quote to template literal wrapper if it looks like:
  // className={`${isDark ? "text-white" : "text-gray-900"}`}
  // wait, the script replaced `className="text-white"` with `className={\`${isDark ? "text-white" : "text-gray-900"}\`}`
  // That one is actually valid JSX, so it didn't break the build! It was the replacements INSIDE existing template literals that broke it.
  
  fs.writeFileSync(file, content);
  console.log(`Reverted nested templates in ${file}`);
});
