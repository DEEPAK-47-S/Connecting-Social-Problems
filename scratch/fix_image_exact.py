import os
import re

def fix_all_images(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We want to target the classNames of the image tags that show the post images.
    # Usually they follow `src={post.imageUrl...` or `src={imagePreview...`
    # Let's find all `img` tags and their `className` attributes that contain `object-cover` or `object-contain`.
    
    # Simple regex to replace the className of img tags
    pattern = re.compile(r'className="[^"]*(?:object-cover|object-contain)[^"]*"')
    
    # We only want to replace it with a clean class that respects aspect ratio exactly
    # `w-full h-auto rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800`
    
    def replacer(match):
        return 'className="w-full h-auto rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800"'
        
    new_content = pattern.sub(replacer, content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

base = "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\"
for root, dirs, files in os.walk(base):
    for file in files:
        if file.endswith('.tsx'):
            fix_all_images(os.path.join(root, file))

print("All image display constraints removed!")
