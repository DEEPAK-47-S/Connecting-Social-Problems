import os
import re

directory = r"c:\deepak\coding\Connecting Social Problems\apps\web\src"

logo_image_tag = '<Image src="/logo.jpg" alt="Connecting Social Problem Logo" width={40} height={40} className="rounded-xl shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform flex-shrink-0 object-cover" />'
logo_image_tag_large = '<Image src="/logo.jpg" alt="Connecting Social Problem Logo" width={48} height={48} className="rounded-xl shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform flex-shrink-0 object-cover" />'

def process_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    changed = False

    # Standard h-10 w-10 icon blocks
    pattern1 = r'<div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform flex-shrink-0">\s*<[^>]+text-white[^>]*/>\s*</div>'
    if re.search(pattern1, content):
        content = re.sub(pattern1, logo_image_tag, content)
        changed = True

    # Home page h-12 w-12 large icon blocks
    pattern2 = r'<div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20 flex-shrink-0">\s*<[^>]+text-white[^>]*/>\s*</div>'
    if re.search(pattern2, content):
        content = re.sub(pattern2, logo_image_tag_large, content)
        changed = True

    if changed:
        if 'import Image from "next/image"' not in content:
            content = 'import Image from "next/image";\n' + content
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated: {filepath}")

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(".tsx"):
            process_file(os.path.join(root, file))

print("Logo injection complete.")
