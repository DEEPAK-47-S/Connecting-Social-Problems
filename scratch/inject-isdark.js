const fs = require('fs');

const loginFiles = [
  'apps/web/src/app/admin/login/page.tsx',
  'apps/web/src/app/college/login/page.tsx',
  'apps/web/src/app/industry/login/page.tsx'
];

loginFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Check if useTheme is imported
  if (!content.includes('useTheme')) {
    content = content.replace(/import \{([^}]+)\} from "react";/, 'import { $1 } from "react";\nimport { useTheme } from "@/context/ThemeContext";');
  }

  // Check if isDark is defined inside the component
  if (!content.includes('const isDark')) {
    // Find the main component function
    content = content.replace(/export default function[^{]+\{/, match => {
      return match + '\n  const { theme } = useTheme();\n  const isDark = theme === "dark";';
    });
  }

  fs.writeFileSync(file, content);
  console.log(`Fixed isDark in ${file}`);
});
