const fs = require('fs');

function patchModal(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. State
    const stateTarget = `  const [district, setDistrict] = useState("Chennai");\n  const [pincode, setPincode] = useState("");`;
    const stateRepl = `  const [district, setDistrict] = useState("Chennai");\n  const [pincode, setPincode] = useState("");\n  const [state, setState] = useState("Tamil Nadu");\n  const [isOtherDistrict, setIsOtherDistrict] = useState(false);`;
    if (!content.includes('const [state, setState]')) {
        content = content.replace(stateTarget, stateRepl);
    }

    // 2. Geo API
    const geoTarget = `          const res = await fetch(
            \`https://nominatim.openstreetmap.org/reverse?lat=\${latitude}&lon=\${longitude}&format=json&accept-language=en\`,
            { headers: { 'User-Agent': 'ConnectingSocialProblems/1.0' } }
          );
          const data = await res.json();
          const addr = data.address || {};
          // Fill fields from the Nominatim address object
          const detectedLandmark = addr.amenity || addr.tourism || addr.building || addr.shop || addr.road || "";
          const detectedStreet = [addr.house_number, addr.road].filter(Boolean).join(', ');
          const detectedArea = addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.city_district || "";
          const detectedDistrict = addr.county || addr.state_district || "";
          const detectedPincode = addr.postcode || "";
          if (detectedLandmark) setLandmark(detectedLandmark);
          if (detectedStreet) setStreet(detectedStreet);
          if (detectedArea) setArea(detectedArea);
          // Try to match detected district to Tamil Nadu districts list
          if (detectedDistrict) {
            const match = TAMIL_NADU_DISTRICTS.find(
              d => detectedDistrict.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(detectedDistrict.toLowerCase())
            );
            if (match) setDistrict(match);
          }
          if (detectedPincode) setPincode(detectedPincode.replace(/\\D/g, "").slice(0, 6));`;

    const geoRepl = `          const res = await fetch(
            \`https://nominatim.openstreetmap.org/reverse?lat=\${latitude}&lon=\${longitude}&format=json&accept-language=en&zoom=18\`,
            { headers: { 'User-Agent': 'ConnectingSocialProblems/1.0' } }
          );
          const data = await res.json();
          const addr = data.address || {};
          
          const detectedLandmark = addr.amenity || addr.tourism || addr.building || addr.shop || addr.historic || addr.leisure || "";
          const detectedStreet = [addr.house_number, addr.road, addr.street].filter(Boolean).join(', ');
          const detectedArea = addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.city_district || addr.residential || "";
          const detectedDistrict = addr.county || addr.state_district || addr.city || "";
          const detectedState = addr.state || "";
          const detectedPincode = addr.postcode || "";

          if (detectedLandmark) setLandmark(detectedLandmark);
          if (detectedStreet) setStreet(detectedStreet);
          if (detectedArea) setArea(detectedArea);
          if (detectedState) setState(detectedState);

          if (detectedDistrict) {
            if (detectedState === "Tamil Nadu" || detectedState === "") {
              const match = TAMIL_NADU_DISTRICTS.find(
                d => detectedDistrict.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(detectedDistrict.toLowerCase())
              );
              if (match) {
                setDistrict(match);
                setIsOtherDistrict(false);
              } else {
                setDistrict(detectedDistrict);
                setIsOtherDistrict(true);
              }
            } else {
              setDistrict(detectedDistrict);
              setIsOtherDistrict(true);
            }
          }
          if (detectedPincode) setPincode(detectedPincode.replace(/\\D/g, "").slice(0, 6));`;

    content = content.replace(geoTarget, geoRepl);

    // 3. Location Parts
    const locTarget = `      const locationParts = [
        landmark.trim() ? \`Near \${landmark.trim()}\` : "",
        street.trim(),
        area.trim(),
        \`\${district} District\`,
        pincode.trim() ? \`PIN: \${pincode.trim()}\` : "",
        "Tamil Nadu"
      ].filter(Boolean);`;

    const locRepl = `      const locationParts = [
        landmark.trim() ? \`Near \${landmark.trim()}\` : "",
        street.trim(),
        area.trim(),
        district.trim() ? \`\${district.trim()} District\` : "",
        pincode.trim() ? \`PIN: \${pincode.trim()}\` : "",
        state.trim()
      ].filter(Boolean);`;

    content = content.replace(locTarget, locRepl);

    // 4. Form Data
    const formDataTarget = `      formData.append("district", district);`;
    const formDataRepl = `      formData.append("district", district);\n      formData.append("state", state);`;
    if (!content.includes('formData.append("state", state);')) {
        content = content.replace(formDataTarget, formDataRepl);
    }

    // 5. JSX
    const jsxTarget = `            {/* Area, District, Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
                  District (38 TN Districts)
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-2 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {TAMIL_NADU_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
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
            </div>`;

    const jsxRepl = `            {/* Area, District, Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5">
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  State *
                </label>
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    if (e.target.value !== "Tamil Nadu") setIsOtherDistrict(true);
                    else setIsOtherDistrict(false);
                  }}
                  className="w-full px-2 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  District *
                </label>
                {state === "Tamil Nadu" && !isOtherDistrict ? (
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
                    {TAMIL_NADU_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                    <option value="Others">Others (Type manually)</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Enter District Name"
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                )}
              </div>
            </div>`;

    content = content.replace(jsxTarget, jsxRepl);

    fs.writeFileSync(filePath, content);
}

const basePath = "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\components\\";
patchModal(basePath + "CreatePostModal.tsx");
patchModal(basePath + "EditPostModal.tsx");
console.log("Modals patched successfully!");
