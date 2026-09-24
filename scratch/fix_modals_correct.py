import os
import re

def fix_modal(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update handleUseMyLocation
    old_geo = """const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
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
          if (detectedPincode) setPincode(detectedPincode.replace(/\\D/g, "").slice(0, 6));
        } catch {
          setError("Could not fetch address. Please fill location manually.");
        } finally {
          setGeoLocating(false);
        }
      },
      (err) => {
        setGeoLocating(false);
        if (err.code === 1) setError("Location permission denied. Please allow location access and try again.");
        else setError("Could not detect location. Please fill manually.");
      },
      { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
    );
  };"""
    
    new_geo = """const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
            { headers: { 'User-Agent': 'ConnectingSocialProblems/1.0' } }
          );
          const data = await res.json();
          const addr = data.address || {};
          
          const detectedLandmark = addr.amenity || addr.tourism || addr.building || addr.shop || addr.road || "";
          const detectedStreet = [addr.house_number, addr.road].filter(Boolean).join(', ');
          const detectedArea = addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.city_district || "";
          const detectedDistrict = addr.county || addr.state_district || "";
          const detectedState = addr.state || "";
          const detectedPincode = addr.postcode || "";
          
          if (detectedLandmark) setLandmark(detectedLandmark);
          if (detectedStreet) setStreet(detectedStreet);
          if (detectedArea) setArea(detectedArea);
          if (detectedPincode) setPincode(detectedPincode.replace(/\\D/g, "").slice(0, 6));

          let matchedState = "";
          if (detectedState) {
            matchedState = INDIAN_STATES.find(s => detectedState.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(detectedState.toLowerCase())) || "";
            if (matchedState) setState(matchedState);
          }
          
          if (detectedDistrict && matchedState) {
            const districtList = getDistrictsForState(matchedState);
            const matchDist = districtList.find(d => detectedDistrict.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(detectedDistrict.toLowerCase()));
            if (matchDist) setDistrict(matchDist);
            else {
              setIsOtherDistrict(true);
              setDistrict(detectedDistrict);
            }
          } else if (detectedDistrict) {
             setDistrict(detectedDistrict);
          }
        } catch {
          setError("Could not fetch address. Please fill location manually.");
        } finally {
          setGeoLocating(false);
        }
      },
      (err) => {
        setGeoLocating(false);
        if (err.code === 1) setError("Location permission denied. Please allow location access and try again.");
        else setError("Could not detect location. Please fill manually.");
      },
      { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
    );
  };"""
    content = content.replace(old_geo, new_geo)

    # 2. Update formattedLocation to use state instead of Tamil Nadu
    content = content.replace('"Tamil Nadu"', 'state')

    # 3. Update the UI Block
    # Need to replace the whole ` {/* Area, District, Pincode */}` block up to `{/* Description */}`
    ui_regex = re.compile(r'\{\/\* Area, District, Pincode \*\/\}.*?(?=\{\/\* Description \*\/\})', re.DOTALL)
    
    new_ui = """{/* State, District, Area, Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  State *
                </label>
                <select
                  required
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setIsOtherDistrict(false);
                  }}
                  className="w-full px-2 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="" disabled>Select State</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  District *
                </label>
                {getDistrictsForState(state).length > 0 && !isOtherDistrict ? (
                <select
                  required
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
                  required
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
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 600028"
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

            </div>
          </div>

          """
    
    content = ui_regex.sub(lambda _: new_ui, content)
    
    # Also fix "Accurate Ground Location Details (Tamil Nadu)"
    content = content.replace('Accurate Ground Location Details (Tamil Nadu)', 'Accurate Ground Location Details')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base = "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\components\\"
fix_modal(base + "CreatePostModal.tsx")
fix_modal(base + "EditPostModal.tsx")
print("Modals patched successfully!")
