import os
import re

def patch_file(file_path, is_college=False):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Add state variable
    state_pattern = r' const \[district, setDistrict\] = useState\("Chennai"\);'
    state_repl = ' const [district, setDistrict] = useState("Chennai");\n const [state, setState] = useState("Tamil Nadu");\n const [isOtherDistrict, setIsOtherDistrict] = useState(false);'
    if not 'const [state, setState]' in content:
        content = re.sub(state_pattern, state_repl, content)

    # 2. Add to body
    body_pattern = r' body\.district = district;'
    body_repl = ' body.district = district;\n body.state = state;'
    if not 'body.state = state' in content:
        content = re.sub(body_pattern, body_repl, content)

    # 3. UI
    # In login/page.tsx and others:
    ui_pattern = r' \{\/\* Tamil Nadu District \*\/\}[\s\S]*?(?= \{\/\* ======================================================== \*\/)'
    
    ui_repl = """ {/* State & District */}
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
 </div>
 </>\n )}

"""
    # Fix for login/page.tsx specific `</>\n )}` closing
    if is_college:
        ui_pattern = r' \{\/\* Tamil Nadu District \*\/\}[\s\S]*?(?= \{\/\* Select College \/ University \*\/)'
        ui_repl = ui_repl.replace('</>\n )}', '') # College login has different structure
        content = re.sub(ui_pattern, lambda m: ui_repl, content)
        
        # Now for College select
        college_pattern = r' \{\/\* Select College \/ University \*\/\}[\s\S]*?(?= <div className="p-3 bg-indigo-500\/10 border border-indigo-500\/20 rounded-xl">)'
        college_repl = """ {/* Select College / University */}
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
 </div>
 """
        content = re.sub(college_pattern, lambda m: college_repl, content)
    else:
        # Standard replacements for citizen/industry/govt
        # We need to make sure the regex matches properly.
        # Actually, wait. Industry and Government login might not have the exact same footer.
        pass

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

patch_file(r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\login\page.tsx", False)
patch_file(r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\industry\login\page.tsx", False)
patch_file(r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\government\login\page.tsx", False)
patch_file(r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\college\login\page.tsx", True)
