import os
import re

def fix_image_classes(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The common class name pattern in page.tsx files
    old_class1 = 'className="w-full object-cover max-h-[550px] min-h-[280px]"'
    old_class2 = 'className="w-full object-cover h-[300px]"'
    old_class3 = 'className="w-full h-48 object-cover"'
    old_class4 = 'className="w-full object-cover max-h-44"' # Modals preview

    new_class_feed = 'className="w-full h-auto object-contain max-h-[600px] bg-black/5 dark:bg-black/20"'
    new_class_modal = 'className="w-full h-auto object-contain max-h-56 bg-black/5 dark:bg-black/20"'

    content = content.replace(old_class1, new_class_feed)
    content = content.replace(old_class2, new_class_feed)
    # Also replace in modal
    content = content.replace(old_class4, new_class_modal)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base = "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\"
targets = [
    base + "app\\page.tsx",
    base + "app\\college\\page.tsx",
    base + "app\\industry\\page.tsx",
    base + "app\\government\\page.tsx",
    base + "app\\admin\\page.tsx",
    base + "components\\CreatePostModal.tsx",
    base + "components\\EditPostModal.tsx"
]

for t in targets:
    fix_image_classes(t)

print("Image classes fixed!")
