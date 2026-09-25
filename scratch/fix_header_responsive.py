import os
import re

def fix_header(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove <ThemeToggle />
    content = re.sub(r'<\s*ThemeToggle\s*/?>', '', content)
    
    # 2. Fix header classes to not stack on mobile and reduce title size
    
    # page.tsx header
    content = content.replace(
        'w-full flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0',
        'w-full flex flex-row items-center justify-between gap-2'
    )
    content = content.replace(
        'flex flex-wrap items-center justify-center sm:justify-start gap-2.5 group w-full sm:w-auto',
        'flex items-center justify-start gap-2 group'
    )
    # The title text size
    content = content.replace(
        'font-black text-lg sm:text-xl tracking-tight italic text-center sm:text-left break-words',
        'font-black text-[15px] sm:text-lg tracking-tight italic break-words leading-tight'
    )
    
    # Other pages admin/college/industry/government header classes
    content = content.replace(
        'flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0',
        'flex flex-row items-center justify-between gap-2'
    )
    content = content.replace(
        'font-black text-base sm:text-lg tracking-tight break-words',
        'font-black text-sm sm:text-base tracking-tight break-words leading-tight'
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed header in {filepath}")

base = "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\"
pages = [
    "page.tsx",
    "admin\\page.tsx",
    "college\\page.tsx",
    "industry\\page.tsx",
    "government\\page.tsx"
]

for p in pages:
    fix_header(os.path.join(base, p))

