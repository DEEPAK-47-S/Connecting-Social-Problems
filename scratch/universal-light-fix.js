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

  // We want to transform raw tailwind classes in className="..." or className={`...`} 
  // but ONLY if they are not already part of an isDark ternary.
  
  // A naive but effective approach:
  // We can just rely on the fact that Tailwind's `dark:` modifier automatically takes precedence 
  // when `html.dark` is active. So we can just add `dark:` to the dark colors, and append the light color.
  // Wait, if it's already `isDark ? "text-white" : "text-slate-900"`, changing `text-white` to `dark:text-white` is harmless!
  
  // Actually, replacing `text-white` with `dark:text-white text-slate-900` might break if it's already inside `isDark ? "text-white" ...`.
  
  // Instead, let's just use a simple regex that finds exact class strings that are commonly problematic in light mode 
  // and injects the `isDark` ternary properly for them, avoiding ones that already have `${isDark`.

  // 1. Invisible text (e.g., text-indigo-200, text-purple-300, text-blue-300, etc.)
  content = content.replace(/className="([^"]*\btext-(indigo|purple|blue|pink|sky|cyan|emerald|green|amber|rose|orange|teal)-[23]00\b[^"]*)"/g, (match, p1) => {
    let base = p1.replace(/\btext-[a-z]+-[23]00\b/g, (m) => `\${isDark ? "${m}" : "${m.replace(/[23]00/, '700')}"}`);
    return `className={\`${base}\`}`;
  });

  // 2. Hardcoded dark backgrounds (e.g., bg-slate-900, bg-zinc-900)
  content = content.replace(/className="([^"]*\bbg-(slate|zinc)-9[05]0\b[^"]*)"/g, (match, p1) => {
    let base = p1.replace(/\bbg-(slate|zinc)-9[05]0\b/g, (m) => `\${isDark ? "${m}" : "bg-white shadow-sm border border-gray-200"}`);
    return `className={\`${base}\`}`;
  });
  
  // 3. For template literals className={`... bg-zinc-900 ...`} without isDark logic on that specific class
  content = content.replace(/(\bbg-(slate|zinc)-900\b)(?![^`]*\bisDark\b)/g, '${isDark ? "$1" : "bg-white shadow-sm border border-gray-200"}');
  content = content.replace(/(\bbg-(slate|zinc)-950\b)(?![^`]*\bisDark\b)/g, '${isDark ? "$1" : "bg-gray-50"}');
  
  // 4. Text classes in template literals without isDark
  content = content.replace(/(\btext-(indigo|purple|blue|pink|sky|cyan|emerald|green|amber|rose|orange|teal)-[23]00\b)(?![^`]*\bisDark\b)/g, (match) => {
    return `\${isDark ? "${match}" : "${match.replace(/[23]00/, '700')}"}`;
  });
  content = content.replace(/(\btext-(slate|zinc)-400\b)(?![^`]*\bisDark\b)/g, '${isDark ? "$1" : "text-gray-600"}');
  content = content.replace(/(\btext-white\b)(?![^`]*\bisDark\b)/g, '${isDark ? "$1" : "text-gray-900"}');

  fs.writeFileSync(file, content);
  console.log(`Universal light mode fix applied to ${file}`);
});
