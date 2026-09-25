import os

file_path = "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\page.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix imports
if "Globe" not in content and "LocationPickerMap" not in content:
    content = content.replace("Edit3\n} from \"lucide-react\";", "Edit3, Globe\n} from \"lucide-react\";\nimport dynamic from \"next/dynamic\";\nconst LocationPickerMap = dynamic(() => import(\"@/components/LocationPickerMap\"), { ssr: false });")

# Fix state
if "const [showMap, setShowMap] = useState(false);" not in content:
    content = content.replace("const [deleteSuccessToast, setDeleteSuccessToast] = useState(\"\");", "const [deleteSuccessToast, setDeleteSuccessToast] = useState(\"\");\n const [showMap, setShowMap] = useState(false);")

# Fix search bar
if "<Globe className=\"h-4 w-4\" />" not in content:
    search_bar_end = """ {searchQuery && (
 <button
 onClick={() => setSearchQuery("")}
 className="absolute right-10 top-2.5 text-zinc-400 hover:text-zinc-600"
 >
 <X className="h-4 w-4" />
 </button>
 )}
 <button
 onClick={() => setShowMap(true)}
 className="absolute right-3 top-2.5 text-zinc-400 hover:text-indigo-500 transition"
 >
 <Globe className="h-4 w-4" />
 </button>
 </div>"""
    
    content = content.replace(""" {searchQuery && (
 <button
 onClick={() => setSearchQuery("")}
 className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
 >
 <X className="h-4 w-4" />
 </button>
 )}
 </div>""", search_bar_end)

# Fix end of file
replacement = """  )}

  {showMap && (
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
  )}
 </div>
 );
}"""

if "LocationPickerMap" not in content.split("ProfileModal")[2] if len(content.split("ProfileModal")) > 2 else "":
    content = content.replace("  )}\n </div>\n );\n}", replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Finished fixing page.tsx")
