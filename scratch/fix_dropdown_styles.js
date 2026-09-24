const fs = require('fs');

const files = [
    "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\industry\\login\\page.tsx",
    "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\college\\login\\page.tsx"
];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Fix background of the dropdown container
        content = content.replace(/bg-zinc-900 border border-zinc-700/g, 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700');
        content = content.replace(/divide-zinc-800/g, 'divide-zinc-100 dark:divide-zinc-800');
        
        // Fix hover background
        content = content.replace(/hover:bg-zinc-800\/80/g, 'hover:bg-zinc-50 dark:hover:bg-zinc-800/80');

        // Fix text colors
        content = content.replace(/text-foreground/g, 'text-zinc-900 dark:text-white');
        
        // Fix tags
        content = content.replace(/text-pink-300 rounded font-semibold/g, 'text-pink-600 dark:text-pink-300 rounded font-semibold');
        content = content.replace(/text-emerald-400/g, 'text-emerald-500 dark:text-emerald-400');
        content = content.replace(/text-indigo-300 rounded font-semibold/g, 'text-indigo-600 dark:text-indigo-300 rounded font-semibold');
        
        // Fix "New Enterprise" / "New College" block
        content = content.replace(/bg-pink-950\/40 hover:bg-pink-900\/50/g, 'bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100 dark:hover:bg-pink-900/50');
        content = content.replace(/text-pink-300/g, 'text-pink-600 dark:text-pink-300');
        content = content.replace(/text-pink-400/g, 'text-pink-600 dark:text-pink-400');

        content = content.replace(/bg-indigo-950\/40 hover:bg-indigo-900\/50/g, 'bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50');
        content = content.replace(/text-indigo-300/g, 'text-indigo-600 dark:text-indigo-300');
        content = content.replace(/text-indigo-400/g, 'text-indigo-600 dark:text-indigo-400');

        fs.writeFileSync(file, content);
    }
}
console.log("Dropdown styles successfully patched for light mode visibility!");
