import os
import re

file_path = "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\page.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure LocationPickerMap is imported
if "LocationPickerMap" not in content:
    content = content.replace("const GlobalComplaintsMap = dynamic(() => import(\"@/components/GlobalComplaintsMap\"), { ssr: false });", "const LocationPickerMap = dynamic(() => import(\"@/components/LocationPickerMap\"), { ssr: false });")

# Replace map usage
pattern = r"<GlobalComplaintsMap[\s\S]*?/>"
replacement = """<LocationPickerMap
      onClose={() => setShowMap(false)}
      onSelectLocation={(data) => {
        const { address } = data;
        if (address) {
          const detectedLoc = address.suburb || address.neighbourhood || address.village || address.city_district || address.state_district || address.city || address.town;
          if (detectedLoc) {
            setSearchQuery(detectedLoc.replace(/district/i, "").trim());
          } else if (address.county) {
            setSearchQuery(address.county.replace(/district/i, "").trim());
          } else if (address.state) {
            setSearchQuery(address.state.replace(/district/i, "").trim());
          }
        }
      }}
    />"""

if "<GlobalComplaintsMap" in content:
    content = re.sub(pattern, replacement, content)
else:
    # If not there, let's append it
    if "LocationPickerMap" not in content.split("ProfileModal")[2] if len(content.split("ProfileModal")) > 2 else "":
        content = content.replace("  )}\n </div>\n );\n}", f"  )}}\n\n  {{showMap && (\n    {replacement}\n  )}}\n </div>\n );\n}}")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed page.tsx map behavior")
