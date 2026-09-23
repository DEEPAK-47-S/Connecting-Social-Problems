import os
import re

directory = r"c:\deepak\coding\Connecting Social Problems\apps\web\src"

def process_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    changed = False

    if content.startswith('import Image from "next/image";\n"use client";'):
        content = '"use client";\nimport Image from "next/image";' + content[len('import Image from "next/image";\n"use client";'):]
        changed = True
    elif content.startswith('import Image from "next/image";\n\n"use client";'):
        content = '"use client";\nimport Image from "next/image";\n\n' + content[len('import Image from "next/image";\n\n"use client";'):]
        changed = True
    elif content.startswith('import Image from "next/image";\r\n"use client";'):
        content = '"use client";\r\nimport Image from "next/image";' + content[len('import Image from "next/image";\r\n"use client";'):]
        changed = True

    if changed:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed use client directive in: {filepath}")

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(".tsx"):
            process_file(os.path.join(root, file))

print("Directive fix complete.")
