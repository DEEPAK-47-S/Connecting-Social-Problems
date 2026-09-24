const fs = require('fs');

const filePath = 'c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\government\\login\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetRegex = /<div>\s*<label className="block text-\[11px\] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">\s*District\s*<\/label>\s*<div className="relative">\s*<MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" \/>\s*<select\s*value=\{district\}\s*onChange=\{\(e\) => setDistrict\(e.target.value\)\}\s*className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-white dark:bg-zinc-900\/75 text-zinc-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none text-xs font-medium"\s*>\s*\{TAMIL_NADU_DISTRICTS.map\(\(d\) => \(\s*<option key=\{d\} value=\{d\}>\s*\{d\} District\s*<\/option>\s*\)\)\}\s*<\/select>\s*<\/div>\s*<\/div>\s*<\/div>/;

const replacement = `<div>
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
 </div>`;

if (targetRegex.test(content)) {
    content = content.replace(targetRegex, replacement);
    console.log("Regex matched and replaced!");
} else {
    console.log("Regex did NOT match.");
}

// Add state variables
const stateTarget = ` const [district, setDistrict] = useState("Chennai");`;
const stateRepl = ` const [district, setDistrict] = useState("Chennai");\n const [state, setState] = useState("Tamil Nadu");\n const [isOtherDistrict, setIsOtherDistrict] = useState(false);`;
if (!content.includes('const [state, setState]') && content.includes(stateTarget)) {
    content = content.replace(stateTarget, stateRepl);
    console.log("State vars added.");
}

fs.writeFileSync(filePath, content);
