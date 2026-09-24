import os
import re

def reorder_modal(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Parse individual field divs using robust regex
    def get_div_block(label_text):
        pattern = re.compile(rf'<div>\s*<label[^>]*>[^<]*{re.escape(label_text)}[^<]*</label>.*?</div>\n', re.DOTALL)
        match = pattern.search(content)
        return match.group(0) if match else ""

    landmark = get_div_block("Accurate Landmark")
    street = get_div_block("Street / Road / Door No.")
    area = get_div_block("Area / Locality / Ward")
    state = get_div_block("State")
    district = get_div_block("District")
    pincode = get_div_block("Pincode")

    # Combine them in the requested order
    new_location_block = f"""{{/* Accurate Ground Location Details */}}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
{landmark}
{street}
{area}
{state}
{district}
{pincode}
            </div>"""

    # Replace the old location block
    # from: {/* Landmark & Street */} to just before {/* Description */}
    loc_pattern = re.compile(r'\{\/\* Landmark & Street \*\/\}.*?(?=\{\/\* Description \*\/\})', re.DOTALL)
    content = loc_pattern.sub(lambda _: new_location_block + "\n          ", content)

    # 2. Extract and Move Attach Button
    # Find the button and input
    attach_btn_pattern = re.compile(r'<button\s+type="button"\s+onClick=\{\(\) => fileRef\.current\?\.click\(\)\}.*?</button>\s*<input ref=\{fileRef\}[^>]*>', re.DOTALL)
    btn_match = attach_btn_pattern.search(content)
    if btn_match:
        btn_code = btn_match.group(0)
        # Remove from footer
        content = content.replace(btn_code, "")
        
        # Change footer justify-between to justify-end
        content = content.replace('className="flex items-center justify-between p-5', 'className="flex items-center justify-end p-5')
        
        # Insert button after description length counter
        desc_length_pattern = re.compile(r'<p className="text-\[10px\] text-zinc-400 text-right mt-1">\{description\.length\}/2000 characters</p>\n\s*</div>')
        desc_match = desc_length_pattern.search(content)
        if desc_match:
            new_btn_block = f"""
            <div className="mt-3">
              {btn_code}
            </div>
          </div>"""
            content = content.replace(desc_match.group(0), desc_match.group(0).replace('</div>', new_btn_block))

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base = "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\components\\"
reorder_modal(base + "CreatePostModal.tsx")
reorder_modal(base + "EditPostModal.tsx")
print("Modals reordered successfully!")
