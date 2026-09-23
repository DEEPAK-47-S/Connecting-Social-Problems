import os

files = [
    r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\login\page.tsx",
    r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\college\login\page.tsx",
    r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\industry\login\page.tsx"
]

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove the `isLogin && ` condition so registration triggers OTP
    content = content.replace("if (isLogin && data.requiresOtp) {", "if (data.requiresOtp) {")
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Updated frontend logic to enforce OTP for registration.")
