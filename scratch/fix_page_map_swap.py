import os

file_path = "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\page.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """  {showMap && (
    <LocationPickerMap
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
    />
  )}"""

replacement = """  {showMap && (
    <GlobalComplaintsMap
      posts={filteredPosts}
      onClose={() => setShowMap(false)}
    />
  )}"""

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully replaced LocationPickerMap with GlobalComplaintsMap")
else:
    print("Could not find the target string. The file might have different spacing.")
