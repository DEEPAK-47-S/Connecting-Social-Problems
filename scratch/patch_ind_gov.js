const fs = require('fs');

function patchIndustry(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove "Tamil Nadu" references
    content = content.replace(/Tamil Nadu Industry CSR/g, 'Industry CSR');
    content = content.replace(/Tamil Nadu Companies/g, 'Companies');
    content = content.replace(/Tamil Nadu District/g, 'District');

    // In my previous patch, I added District & State to industry/login/page.tsx. Let's see if it's there.
    // Wait, earlier I replaced the "Tamil Nadu District" block with the generic State/District block in patch_auth.js.
    // I need to wrap the Industry Search Autocomplete with State condition.

    const industrySearchTarget = ` {/* Industry Search / Autocomplete Field */}
 <div ref={dropdownRef} className="relative">
 <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 flex items-center justify-between">
 <span>Company / Industry Name (Autocomplete)</span>
 <span className="text-[10px] text-pink-400 font-semibold">{allIndustries.length}+ Companies</span>
 </label>

 <div className="relative">
 <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
 <input
 type="text"
 required={!isLogin}
 value={industryQuery}
 onChange={handleIndustryInputChange}
 onFocus={() => setShowSuggestions(true)}
 placeholder="Type to search or enter company name..."
 className={\`w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-800 bg-white dark:bg-zinc-900/75 placeholder-zinc-500 focus:ring-2 focus:ring-pink-500 outline-none text-xs font-medium text-foreground\`}
 />
 <ChevronDown
 className="absolute right-3.5 top-3 h-4 w-4 text-zinc-500 cursor-pointer"
 onClick={() => setShowSuggestions(!showSuggestions)}
 />
 </div>

 {/* Live Suggestions Dropdown */}
 {showSuggestions && suggestions.length > 0 && (
 <div className="absolute z-50 left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-md max-h-56 overflow-y-auto divide-y divide-zinc-800 animate-in fade-in">
 {suggestions.map((ind, i) => (
 <div
 key={i}
 onClick={() => handleSelectSuggestion(ind)}
 className="p-3 hover:bg-zinc-800/80 cursor-pointer transition flex items-start justify-between gap-2"
 >
 <div>
 <p className={\`text-xs font-bold flex items-center gap-1.5 text-foreground\`}>
 <span>{ind.name}</span>
 <span className="text-[9px] px-1.5 py-0.2 bg-pink-500/20 text-pink-300 rounded font-semibold">
 {ind.district}
 </span>
 </p>
 <p className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-0.5">
 {ind.sector} · Grant: {ind.grantRange}
 </p>
 </div>
 {selectedIndustry?.name === ind.name && (
 <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
 )}
 </div>
 ))}

 {industryQuery.trim() && !allIndustries.some((i) => i.name.toLowerCase() === industryQuery.trim().toLowerCase()) && (
 <div
 onClick={() => {
 setIsNewIndustry(true);
 setShowSuggestions(false);
 }}
 className="p-3 bg-pink-950/40 hover:bg-pink-900/50 cursor-pointer transition flex items-center gap-2 text-xs font-bold text-pink-300"
 >
 <Plus className="h-4 w-4 text-pink-400" />
 <span>Register new enterprise: &quot;{industryQuery}&quot;</span>
 </div>
 )}
 </div>
 )}
 </div>`;

    const industrySearchRepl = ` {/* Industry Search / Autocomplete Field */}
 <div ref={dropdownRef} className="relative">
 <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5 flex items-center justify-between">
 <span>{state === "Tamil Nadu" ? "Company / Industry Name (Autocomplete)" : "Enter Company / Industry Name"}</span>
 {state === "Tamil Nadu" && <span className="text-[10px] text-pink-400 font-semibold">{allIndustries.length}+ Companies</span>}
 </label>

 <div className="relative">
 <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
 {state === "Tamil Nadu" ? (
 <>
 <input
 type="text"
 required={!isLogin}
 value={industryQuery}
 onChange={handleIndustryInputChange}
 onFocus={() => setShowSuggestions(true)}
 placeholder="Type to search or enter company name..."
 className={\`w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-800 bg-white dark:bg-zinc-900/75 placeholder-zinc-500 focus:ring-2 focus:ring-pink-500 outline-none text-xs font-medium text-foreground\`}
 />
 <ChevronDown
 className="absolute right-3.5 top-3 h-4 w-4 text-zinc-500 cursor-pointer"
 onClick={() => setShowSuggestions(!showSuggestions)}
 />
 </>
 ) : (
 <input
 type="text"
 required={!isLogin}
 value={targetCompanyName}
 onChange={(e) => { setTargetCompanyName(e.target.value); setIsNewIndustry(true); }}
 placeholder="Enter your company name..."
 className={\`w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-800 bg-white dark:bg-zinc-900/75 placeholder-zinc-500 focus:ring-2 focus:ring-pink-500 outline-none text-xs font-medium text-foreground\`}
 />
 )}
 </div>

 {/* Live Suggestions Dropdown */}
 {state === "Tamil Nadu" && showSuggestions && suggestions.length > 0 && (
 <div className="absolute z-50 left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-md max-h-56 overflow-y-auto divide-y divide-zinc-800 animate-in fade-in">
 {suggestions.map((ind, i) => (
 <div
 key={i}
 onClick={() => handleSelectSuggestion(ind)}
 className="p-3 hover:bg-zinc-800/80 cursor-pointer transition flex items-start justify-between gap-2"
 >
 <div>
 <p className={\`text-xs font-bold flex items-center gap-1.5 text-foreground\`}>
 <span>{ind.name}</span>
 <span className="text-[9px] px-1.5 py-0.2 bg-pink-500/20 text-pink-300 rounded font-semibold">
 {ind.district}
 </span>
 </p>
 <p className="text-[10px] text-zinc-600 dark:text-zinc-400 mt-0.5">
 {ind.sector} · Grant: {ind.grantRange}
 </p>
 </div>
 {selectedIndustry?.name === ind.name && (
 <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
 )}
 </div>
 ))}

 {industryQuery.trim() && !allIndustries.some((i) => i.name.toLowerCase() === industryQuery.trim().toLowerCase()) && (
 <div
 onClick={() => {
 setIsNewIndustry(true);
 setShowSuggestions(false);
 }}
 className="p-3 bg-pink-950/40 hover:bg-pink-900/50 cursor-pointer transition flex items-center gap-2 text-xs font-bold text-pink-300"
 >
 <Plus className="h-4 w-4 text-pink-400" />
 <span>Register new enterprise: &quot;{industryQuery}&quot;</span>
 </div>
 )}
 </div>
 )}
 </div>`;
    
    // Check if my patch_auth.js failed to patch industry/login/page.tsx due to the `</>\n )}` regex issue.
    // I need to use the flexible replacement for State dropdown if it's missing.
    // The previous script DID print "Auth pages patched!", but maybe it didn't do anything for industry if it didn't match.

    // I will replace `Tamil Nadu District` -> `District` first for consistency with the regex target in `industrySearchTarget`.
    // Wait, let's just make sure we replace the industrySearchTarget.
    // I can do a loose replacement just in case.
    
    const startIndex = content.indexOf('{/* Industry Search / Autocomplete Field */}');
    const endIndex = content.indexOf('{/* Detailed Industry Configuration */}');
    
    if (startIndex !== -1 && endIndex !== -1) {
        content = content.substring(0, startIndex) + industrySearchRepl + '\n\n ' + content.substring(endIndex);
    }

    fs.writeFileSync(filePath, content);
}

function patchGovt(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/Tamil Nadu District/g, 'District');
    content = content.replace(/Tamil Nadu Government/g, 'Government');

    const govtTargetStart = `{/* Select Municipal / Government Directorate */}`;
    const govtTargetEnd = `{/* Officer Designation & District */}`;

    const govtRepl = `{/* Select Municipal / Government Directorate */}
 <div>
 <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
 {state === "Tamil Nadu" ? "Department / Authority Division" : "Enter Department / Authority Name"}
 </label>
 <div className="relative">
 <Building className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
 {state === "Tamil Nadu" ? (
 <select
 value={authorityName}
 onChange={(e) => setAuthorityName(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-white dark:bg-zinc-900/75 text-zinc-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none text-xs font-medium"
 >
 {PRESET_AUTHORITIES.map((a, i) => (
 <option key={i} value={a.name}>
 {a.name} ({a.dept})
 </option>
 ))}
 </select>
 ) : (
 <input
 type="text"
 required={!isLogin}
 value={authorityName}
 onChange={(e) => setAuthorityName(e.target.value)}
 placeholder="Enter your department name..."
 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-white dark:bg-zinc-900/75 text-zinc-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 outline-none text-xs font-medium"
 />
 )}
 </div>
 </div>

 `;

    const startIndex = content.indexOf(govtTargetStart);
    const endIndex = content.indexOf(govtTargetEnd);
    
    if (startIndex !== -1 && endIndex !== -1) {
        content = content.substring(0, startIndex) + govtRepl + content.substring(endIndex);
    }

    fs.writeFileSync(filePath, content);
}

function removeTamilNadu(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/Tamil Nadu District/g, 'District');
    // For CreatePostModal, EditPostModal, page.tsx
    content = content.replace(/District \(38 TN Districts\)/g, 'District');
    fs.writeFileSync(filePath, content);
}


patchIndustry("c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\industry\\login\\page.tsx");
patchGovt("c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\government\\login\\page.tsx");

removeTamilNadu("c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\login\\page.tsx");
removeTamilNadu("c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\college\\login\\page.tsx");
removeTamilNadu("c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\components\\CreatePostModal.tsx");
removeTamilNadu("c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\components\\EditPostModal.tsx");

console.log("Industry and Govt pages patched!");
