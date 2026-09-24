const fs = require('fs');
const path = require('path');

function fixAuthFile(filePath, type) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Make sure we have the imports
    if (!content.includes('INDIAN_STATES')) {
        const importStr = `import { INDIAN_STATES } from "@/data/indianStates";\nimport { getDistrictsForState } from "@/data/districts";\n`;
        const lastImportIndex = content.lastIndexOf('import ');
        const endOfImport = content.indexOf('\n', lastImportIndex);
        content = content.substring(0, endOfImport) + '\n' + importStr + content.substring(endOfImport);
    }

    if (type === 'college' && !content.includes('getCollegesForState')) {
        const importStr = `import { getCollegesForState } from "@/data/colleges";\n`;
        const lastImportIndex = content.lastIndexOf('import ');
        const endOfImport = content.indexOf('\n', lastImportIndex);
        content = content.substring(0, endOfImport) + '\n' + importStr + content.substring(endOfImport);
    }

    // Add state variables if missing
    if (!content.includes('const [state, setState]')) {
        const stateTarget = `const [district, setDistrict] = useState("Chennai");`;
        const stateRepl = `const [district, setDistrict] = useState("Chennai");\n  const [state, setState] = useState("Jharkhand");\n  const [isOtherDistrict, setIsOtherDistrict] = useState(false);`;
        content = content.replace(stateTarget, stateRepl);
    } else {
        content = content.replace(/const \[state, setState\] = useState\(["']Tamil Nadu["']\);/, 'const [state, setState] = useState("Jharkhand");');
    }

    // Citizen login specific replace
    if (type === 'citizen') {
        const districtMatch = content.match(/\{\/\* District \*\/\}([\s\S]*?)<\/div>\s*<\/div>\s*<\/>\s*\)}/);
        if (districtMatch) {
            const genericUI = `{/* State & District */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
  <div>
  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
  State
  </label>
  <div className="relative">
  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
  <select
  value={state}
  onChange={(e) => {
    setState(e.target.value);
    setIsOtherDistrict(false);
  }}
  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
  >
  {INDIAN_STATES.map((s) => (
    <option key={s} value={s}>{s}</option>
  ))}
  </select>
  </div>
  </div>

  <div>
  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
  District
  </label>
  <div className="relative">
  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
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
  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
  >
  {getDistrictsForState(state).map((d) => (
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
  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
  />
  )}
  </div>
  </div>
  </div>
  </>
  )}`;
            content = content.replace(districtMatch[0], genericUI);
        }
    }

    if (type === 'college') {
        const districtMatch = content.match(/\{\/\* District \*\/\}([\s\S]*?)<\/div>\s*<\/div>\s*\{\/\* Select College \/ University \*\/\}/);
        if (districtMatch) {
            const genericUI = `{/* State & District */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
  <div>
  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
  State
  </label>
  <div className="relative">
  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
  <select
  value={state}
  onChange={(e) => {
    setState(e.target.value);
    setIsOtherDistrict(false);
  }}
  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
  >
  {INDIAN_STATES.map((s) => (
    <option key={s} value={s}>{s}</option>
  ))}
  </select>
  </div>
  </div>

  <div>
  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
  District
  </label>
  <div className="relative">
  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
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
  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
  >
  {getDistrictsForState(state).map((d) => (
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
  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
  />
  )}
  </div>
  </div>
  </div>
  {/* Select College / University */}`;
            content = content.replace(districtMatch[0], genericUI);
        }

        // Fix college dropdown map
        content = content.replace(/\{COLLEGES_LIST\.map/g, '{getCollegesForState(state).map');
        content = content.replace(/state === "Tamil Nadu" \? "Select College \/ University" : "Enter College \/ University Name"/g, 
            'getCollegesForState(state).length > 0 ? "Select College / University" : "Enter College / University Name"');
        content = content.replace(/\{state === "Tamil Nadu" \? \(/g, '{getCollegesForState(state).length > 0 ? (');
    }

    if (type === 'industry') {
        const districtMatch = content.match(/\{\/\* Detailed Industry Configuration \*\/\}([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/>\s*\)}/);
        if (districtMatch) {
            const genericUI = `{/* Detailed Industry Configuration */}
  <div className="p-4 rounded-2xl bg-pink-950/25 border border-pink-500/20 space-y-3">
  <div className="flex items-center justify-between">
  <span className="text-[11px] font-bold text-pink-300 flex items-center gap-1.5">
  <Sparkles className="h-3.5 w-3.5 text-pink-400" />
  <span>Sector, District & State</span>
  </span>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  <div className="relative">
  <Building2 className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
  <select
  value={sector}
  onChange={(e) => setSector(e.target.value)}
  className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-800 bg-white dark:bg-zinc-900/75 text-zinc-900 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none text-[11px] font-medium"
  >
  {INDUSTRY_SECTORS.map((s) => (
  <option key={s} value={s}>{s}</option>
  ))}
  </select>
  </div>
  
  <div className="relative">
  <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
  <select
  value={state}
  onChange={(e) => {
    setState(e.target.value);
    setIsOtherDistrict(false);
  }}
  className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-800 bg-white dark:bg-zinc-900/75 text-zinc-900 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none text-[11px] font-medium"
  >
  {INDIAN_STATES.map((s) => (
    <option key={s} value={s}>{s}</option>
  ))}
  </select>
  </div>

  <div className="relative sm:col-span-2">
  <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
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
  className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-800 bg-white dark:bg-zinc-900/75 text-zinc-900 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none text-[11px] font-medium"
  >
  {getDistrictsForState(state).map((d) => (
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
  className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-800 bg-white dark:bg-zinc-900/75 text-zinc-900 dark:text-white placeholder-zinc-500 focus:ring-2 focus:ring-pink-500 outline-none text-[11px] font-medium"
  />
  )}
  </div>
  </div>
  </div>
  </>
  )}`;
            content = content.replace(districtMatch[0], genericUI);
        }
    }

    fs.writeFileSync(filePath, content);
}

const basePath = "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\";
fixAuthFile(basePath + "login\\page.tsx", 'citizen');
fixAuthFile(basePath + "industry\\login\\page.tsx", 'industry');
fixAuthFile(basePath + "college\\login\\page.tsx", 'college');
console.log("Pages fixed with State dropdowns!");
