const fs = require('fs');

const files = [
  'apps/web/src/app/college/page.tsx',
  'apps/web/src/app/industry/dashboard/page.tsx',
  'apps/web/src/app/government/page.tsx',
  'apps/web/src/app/admin/page.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const newLines = lines.map(line => {
    // Skip lines that have isDark ternary logic to avoid breaking them
    if (line.includes('isDark ?') || line.includes('isDark\n') || line.includes('{isDark}')) {
      return line;
    }

    // Replace hardcoded dark-mode classes with responsive dark: classes
    let modified = line;
    
    // Backgrounds
    modified = modified.replace(/\bbg-slate-950\b/g, 'bg-slate-50 dark:bg-slate-950');
    modified = modified.replace(/\bbg-slate-900\b/g, 'bg-white shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-transparent');
    modified = modified.replace(/\bbg-zinc-950\b/g, 'bg-zinc-50 dark:bg-zinc-950');
    modified = modified.replace(/\bbg-zinc-900\b/g, 'bg-white shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-transparent');
    modified = modified.replace(/\bbg-black\b/g, 'bg-white dark:bg-black');
    
    // Text colors
    modified = modified.replace(/\btext-white\b/g, 'text-slate-900 dark:text-white');
    modified = modified.replace(/\btext-slate-400\b/g, 'text-slate-600 dark:text-slate-400');
    modified = modified.replace(/\btext-zinc-400\b/g, 'text-zinc-600 dark:text-zinc-400');
    modified = modified.replace(/\btext-zinc-300\b/g, 'text-zinc-700 dark:text-zinc-300');
    
    // Accent text colors (e.g. text-indigo-200 is invisible on white bg)
    const accentColors = ['indigo', 'purple', 'blue', 'pink', 'sky', 'cyan', 'emerald', 'green', 'amber', 'rose', 'orange', 'teal'];
    accentColors.forEach(color => {
      const regex200 = new RegExp(`\\btext-${color}-200\\b`, 'g');
      modified = modified.replace(regex200, `text-${color}-700 dark:text-${color}-200`);
      
      const regex300 = new RegExp(`\\btext-${color}-300\\b`, 'g');
      modified = modified.replace(regex300, `text-${color}-700 dark:text-${color}-300`);
      
      const regex400 = new RegExp(`\\btext-${color}-400\\b`, 'g');
      modified = modified.replace(regex400, `text-${color}-600 dark:text-${color}-400`);
    });

    return modified;
  });

  fs.writeFileSync(file, newLines.join('\n'));
  console.log(`Applied line-by-line light mode fix to ${file}`);
});
