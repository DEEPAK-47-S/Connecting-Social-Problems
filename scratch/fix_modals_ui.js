const fs = require('fs');

function fixModal(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Add state variable if not present
    if (!content.includes('const [state, setState]')) {
        const target = `const [district, setDistrict] = useState("Chennai");`;
        const repl = `const [district, setDistrict] = useState("Chennai");\n  const [state, setState] = useState("Jharkhand");\n  const [isOtherDistrict, setIsOtherDistrict] = useState(false);`;
        content = content.replace(target, repl);
    } else {
        content = content.replace(/const \[state, setState\] = useState\(["']Tamil Nadu["']\);/, 'const [state, setState] = useState("Jharkhand");');
        if (!content.includes('const [isOtherDistrict, setIsOtherDistrict]')) {
            content = content.replace(/const \[state, setState\] = useState\(["']Jharkhand["']\);/, 'const [state, setState] = useState("Jharkhand");\n  const [isOtherDistrict, setIsOtherDistrict] = useState(false);');
            content = content.replace(/const \[state, setState\] = useState\(post\?.state \|\| ["']Jharkhand["']\);/, 'const [state, setState] = useState(post?.state || "Jharkhand");\n  const [isOtherDistrict, setIsOtherDistrict] = useState(false);');
        }
    }

    const regex = /\{\/\* Area, District, Pincode \*\/\}([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Image Upload \*\/\}/;
    const match = content.match(regex);
    if (match) {
        const replacement = `{/* State, District, Area, Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setIsOtherDistrict(false);
                  }}
                  className="w-full px-2 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  District
                </label>
                {getDistrictsForState(state).length > 0 && !isOtherDistrict ? (
                <select
                  value={district}
                  onChange={(e) => {
                    if (e.target.value === "Others") {
                      setIsOtherDistrict(true);
                      setDistrict("");
                    } else {
                      setDistrict(e.target.value);
                    }
                  }}
                  className="w-full px-2 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {getDistrictsForState(state).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                  <option value="Others">Others (Type manually)</option>
                </select>
                ) : (
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Enter District Name"
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  Area / Locality / Ward *
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Anna Nagar / Ward 12"
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\\D/g, ""))}
                  placeholder="e.g. 600028"
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

            </div>
          </div>

          {/* Image Upload */}`;
        content = content.replace(match[0], replacement);
    }
    
    fs.writeFileSync(filePath, content);
}

fixModal("c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\components\\CreatePostModal.tsx");
fixModal("c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\components\\EditPostModal.tsx");
console.log("Modals patched successfully!");
