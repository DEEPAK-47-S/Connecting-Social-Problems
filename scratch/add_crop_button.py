import os

def add_crop_button(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add import
    if 'Crop,' not in content and 'Crop as CropIcon' not in content:
        content = content.replace('Image as ImageIcon,', 'Image as ImageIcon,\n  Crop,')

    # Replace button section
    old_buttons = """            <div className="mt-3">
              <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >"""
    
    new_buttons = """            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >"""

    # We also need to insert the Crop button right before the hidden input.
    old_input = """          <input ref={fileRef} type="file" accept="image/*" className="text-zinc-900 dark:text-white hidden" onChange={handleImage} />
            </div>"""
    
    new_input = """              {imagePreview && (
                <button
                  type="button"
                  onClick={() => setCropImageSrc(imagePreview)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Crop className="h-4 w-4 text-indigo-500" />
                  <span>Crop Current Photo</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="text-zinc-900 dark:text-white hidden" onChange={handleImage} />
            </div>"""

    content = content.replace(old_buttons, new_buttons)
    content = content.replace(old_input, new_input)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base = "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\components\\"
add_crop_button(base + "CreatePostModal.tsx")
add_crop_button(base + "EditPostModal.tsx")
print("Crop button added to modals!")
