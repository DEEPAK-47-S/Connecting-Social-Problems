import os

login_pages = [
    r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\login\page.tsx",
    r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\admin\login\page.tsx",
    r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\college\login\page.tsx",
    r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\government\login\page.tsx",
    r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\industry\login\page.tsx",
]

for file_path in login_pages:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Move ShieldCheck from react import to lucide-react import
    content = content.replace('import { ShieldCheck,', 'import {')
    
    if "ShieldCheck" not in content.split('from "lucide-react"')[0]:
        content = content.replace('} from "lucide-react";', ', ShieldCheck } from "lucide-react";')

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Imports fixed!")
