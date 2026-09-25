import os
import re

file_path = "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\page.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace <LocationPickerMap ... /> with <GlobalComplaintsMap posts={filteredPosts} onClose={() => setShowMap(false)} />
pattern = r"<LocationPickerMap[\s\S]*?/>"
replacement = "<GlobalComplaintsMap\n      posts={posts}\n      onClose={() => setShowMap(false)}\n    />"

new_content = re.sub(pattern, replacement, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Successfully replaced with GlobalComplaintsMap")
