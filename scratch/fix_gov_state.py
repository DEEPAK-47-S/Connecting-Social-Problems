import os

def fix_gov(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    target = """  </div>

  <div>
  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
  District
  </label>
  <div className="relative">
  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
  <select
  value={district}
  onChange={(e) => setDistrict(e.target.value)}
  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-white dark:bg-zinc-900/75 text-zinc-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none text-xs font-medium"
  >
  {TAMIL_NADU_DISTRICTS.map((d) => (
  <option key={d} value={d}>
  {d} District
  </option>
  ))}
  </select>
  </div>
  </div>
  </div>"""

    replacement = """  </div>

  {/* State & District */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
  <div>
  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
  State
  </label>
  <div className="relative">
  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
  <select
  value={state}
  onChange={(e) => {
    setState(e.target.value);
    if (e.target.value !== "Tamil Nadu") setIsOtherDistrict(true);
    else setIsOtherDistrict(false);
  }}
  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-white dark:bg-zinc-900/75 text-zinc-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none text-xs font-medium"
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
  </div>

  <div>
  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
  District
  </label>
  <div className="relative">
  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
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
  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-white dark:bg-zinc-900/75 text-zinc-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none text-xs font-medium"
  >
  {TAMIL_NADU_DISTRICTS.map((d) => (
  <option key={d} value={d}>
  {d} District
  </option>
  ))}
  <option value="Others">Others (Type manually)</option>
  </select>
  ) : (
  <input
  type="text"
  required={!isLogin}
  value={district}
  onChange={(e) => setDistrict(e.target.value)}
  placeholder="Enter District Name"
  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-white dark:bg-zinc-900/75 text-zinc-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 outline-none text-xs font-medium"
  />
  )}
  </div>
  </div>
  </div>"""

    if target in content:
        content = content.replace(target, replacement)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Government district dropdown updated.")
    else:
        print("Target not found.")

    # We also need to make sure state variables `state` and `isOtherDistrict` exist
    state_target = ' const [district, setDistrict] = useState("Chennai");'
    state_repl = ' const [district, setDistrict] = useState("Chennai");\n const [state, setState] = useState("Tamil Nadu");\n const [isOtherDistrict, setIsOtherDistrict] = useState(false);'
    
    if 'const [state, setState]' not in content and state_target in content:
        content = content.replace(state_target, state_repl)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Added state variables.")

fix_gov(r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\government\login\page.tsx")
