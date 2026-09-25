import os
import re

def patch_modal(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add Import
    if 'import ImageCropper' not in content:
        content = content.replace('import { X', "import ImageCropper from './ImageCropper';\nimport { X", 1)
        if 'import ImageCropper' not in content:
            content = content.replace("import React,", "import React,\nimport ImageCropper from './ImageCropper';\n", 1)

    # 2. Add cropImageSrc state
    if 'const [cropImageSrc, setCropImageSrc]' not in content:
        content = content.replace('const [imagePreview, setImagePreview]', 'const [imagePreview, setImagePreview]\n  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);')

    # 3. Update handleImage
    old_handle = """  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };"""
    new_handle = """  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };"""
    content = content.replace(old_handle, new_handle)

    # 4. Insert Cropper UI at the end of the return statement
    if '<ImageCropper' not in content:
        end_pattern = re.compile(r'(</form>.*?</div>\s*</div>\s*</div>\s*\)\;\s*})', re.DOTALL)
        match = end_pattern.search(content)
        if match:
            # wait, it's just before the final enclosing div of the modal?
            # actually we can just put it anywhere inside the return since it's fixed position
            # Let's place it just before the final </div></div>);
            replacement = """
      {cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          onCropComplete={(croppedFile, previewUrl) => {
            setImage(croppedFile);
            setImagePreview(previewUrl);
            setCropImageSrc(null);
          }}
          onCancel={() => setCropImageSrc(null)}
        />
      )}
"""
            # Insert before the last two divs
            # Find the last `    </div>\n  );\n}`
            final_divs_idx = content.rfind('  );\n}')
            if final_divs_idx != -1:
                content = content[:final_divs_idx] + replacement + content[final_divs_idx:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base = "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\components\\"
patch_modal(base + "CreatePostModal.tsx")
patch_modal(base + "EditPostModal.tsx")
print("Modals patched with image cropper!")
