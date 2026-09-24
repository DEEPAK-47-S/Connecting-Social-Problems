const fs = require('fs');

function patchAuthPage(filePath, type) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. State
    const stateTarget = ` const [district, setDistrict] = useState("Chennai");`;
    const stateRepl = ` const [district, setDistrict] = useState("Chennai");\n const [state, setState] = useState("Tamil Nadu");\n const [isOtherDistrict, setIsOtherDistrict] = useState(false);`;
    if (!content.includes('const [state, setState]')) {
        content = content.replace(stateTarget, stateRepl);
    }

    // 2. body.state
    const bodyTarget = ` body.district = district;`;
    const bodyRepl = ` body.district = district;\n body.state = state;`;
    if (!content.includes('body.state = state;')) {
        content = content.replace(bodyTarget, bodyRepl);
    }

    // 3. UI
    // For Citizen login:
    const citizenUiTarget = ` {/* Tamil Nadu District */}
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
 Tamil Nadu District
 </label>
 <div className="relative">
 <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
 <select
 value={district}
 onChange={(e) => setDistrict(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
 >
 {TAMIL_NADU_DISTRICTS.map((d) => (
 <option key={d} value={d}>
 {d} District
 </option>
 ))}
 </select>
 </div>
 </div>`;

    const commonUiRepl = ` {/* State & District */}
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
   if (e.target.value !== "Tamil Nadu") setIsOtherDistrict(true);
   else setIsOtherDistrict(false);
 }}
 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
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
 <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 mt-4">
 District
 </label>
 <div className="relative">
 <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
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
 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
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
 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
 />
 )}
 </div>
 </div>`;

    if (type === 'citizen' || type === 'industry' || type === 'government' || type === 'college') {
        content = content.replace(citizenUiTarget, commonUiRepl);
    }

    // For college, we also need to patch the college dropdown
    if (type === 'college') {
        const collegeTarget = ` {/* Select College / University */}
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 mt-4">
 Select College / University
 </label>
 <div className="relative">
 <Building className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
 <select
 value={collegeName}
 onChange={(e) => setCollegeName(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
 >
 <option value="" disabled>Select your institution</option>
 {COLLEGES_LIST.map((c) => (
 <option key={c.id} value={c.name}>{c.name} ({c.district})</option>
 ))}
 </select>
 </div>
 </div>`;

        const collegeRepl = ` {/* Select College / University */}
 <div className="mt-4">
 <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
 {state === "Tamil Nadu" ? "Select College / University" : "Enter College / University Name"}
 </label>
 <div className="relative">
 <Building className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
 {state === "Tamil Nadu" ? (
 <select
 value={collegeName}
 onChange={(e) => setCollegeName(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
 >
 <option value="" disabled>Select your institution</option>
 {COLLEGES_LIST.map((c) => (
 <option key={c.id} value={c.name}>{c.name} ({c.district})</option>
 ))}
 </select>
 ) : (
 <input
 type="text"
 required={!isLogin}
 value={collegeName}
 onChange={(e) => setCollegeName(e.target.value)}
 placeholder="e.g. National Institute of Technology"
 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
 />
 )}
 </div>
 </div>`;
        content = content.replace(collegeTarget, collegeRepl);
    }

    fs.writeFileSync(filePath, content);
}

const basePath = "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\";
patchAuthPage(basePath + "login\\page.tsx", 'citizen');
patchAuthPage(basePath + "industry\\login\\page.tsx", 'industry');
patchAuthPage(basePath + "government\\login\\page.tsx", 'government');
patchAuthPage(basePath + "college\\login\\page.tsx", 'college');
console.log("Auth pages patched!");
