const fs = require('fs');

const file = 'apps/web/src/app/industry/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('useTheme')) {
  content = content.replace(
    'import { Handshake',
    'import { useTheme } from "@/context/ThemeContext";\nimport { Handshake'
  );
  content = content.replace(
    'export default function IndustryDashboard() {',
    `export default function IndustryDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";`
  );
}

fs.writeFileSync(file, content);
console.log(`Injected useTheme into ${file}`);
