import os
import re

directory = r"c:\deepak\coding\Connecting Social Problems\apps\web\src"
logo_image_tag = '<Image src="/logo.jpg" alt="Connecting Social Problem Logo" width={40} height={40} className="rounded-full shadow-lg group-hover:scale-105 transition-transform flex-shrink-0 object-cover" />'

# Define the specific blocks we found from grep
replacements = {
    r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\login\page.tsx": (
        r'<div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600[^>]*>.*?</div>',
        logo_image_tag
    ),
    r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\page.tsx": (
        r'<div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600[^>]*>.*?</div>',
        '<Image src="/logo.jpg" alt="Logo" width={56} height={56} className="rounded-full shadow-lg flex-shrink-0 object-cover mb-3" />'
    ),
    r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\government\login\page.tsx": (
        r'<div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-500[^>]*>.*?</div>',
        logo_image_tag
    ),
    r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\industry\login\page.tsx": (
        r'<div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500[^>]*>.*?</div>',
        logo_image_tag
    ),
    r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\college\login\page.tsx": (
        r'<div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500[^>]*>.*?</div>',
        logo_image_tag
    ),
    r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\admin\page.tsx": (
        r'<div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600[^>]*>.*?</div>',
        logo_image_tag
    )
}

for file_path, (pattern, replacement) in replacements.items():
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        
        # Second pattern for page.tsx footer logo
        if "page.tsx" in file_path and "from-amber-500 via-rose-500 to-purple-600" in new_content:
            new_content = re.sub(r'<div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600[^>]*>.*?</div>', '<Image src="/logo.jpg" alt="Logo" width={36} height={36} className="rounded-full shadow-lg group-hover:scale-105 transition-transform flex-shrink-0 object-cover" />', new_content, flags=re.DOTALL)

        if new_content != content:
            if 'import Image from "next/image"' not in new_content:
                new_content = 'import Image from "next/image";\n' + new_content
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated: {file_path}")

print("Logo injection complete.")
