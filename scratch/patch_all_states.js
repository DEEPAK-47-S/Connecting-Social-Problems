const fs = require('fs');
const path = require('path');

const filePaths = [
    "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\components\\CreatePostModal.tsx",
    "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\components\\EditPostModal.tsx",
    "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\login\\page.tsx",
    "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\industry\\login\\page.tsx",
    "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\government\\login\\page.tsx",
    "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\college\\login\\page.tsx"
];

function patchFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add imports if missing
    if (!content.includes('INDIAN_STATES')) {
        // Find the last import
        const lastImportIndex = content.lastIndexOf('import ');
        const endOfImport = content.indexOf('\n', lastImportIndex);
        
        let importPathStates = "@/data/indianStates";
        let importPathDistricts = "@/data/districts";
        let importPathColleges = "@/data/colleges";

        const importStr = `\nimport { INDIAN_STATES } from "${importPathStates}";\nimport { getDistrictsForState } from "${importPathDistricts}";\n`;
        content = content.substring(0, endOfImport) + importStr + content.substring(endOfImport);
    }

    if (filePath.includes('college\\login') && !content.includes('getCollegesForState')) {
        const importStr = `import { getCollegesForState } from "@/data/colleges";\n`;
        const lastImportIndex = content.lastIndexOf('import ');
        const endOfImport = content.indexOf('\n', lastImportIndex);
        content = content.substring(0, endOfImport) + importStr + content.substring(endOfImport);
    }

    // 2. Change default state to "Jharkhand"
    content = content.replace(/const \[state, setState\] = useState\(["']Tamil Nadu["']\);/g, 'const [state, setState] = useState("Jharkhand");');
    content = content.replace(/const \[state, setState\] = useState\(post\?.state \|\| ["']Tamil Nadu["']\);/g, 'const [state, setState] = useState(post?.state || "Jharkhand");');

    // 3. Update the State Dropdown mapping
    const oldStateDropdown = `<option value="Tamil Nadu">Tamil Nadu</option>\n  <option value="Kerala">Kerala</option>\n  <option value="Karnataka">Karnataka</option>\n  <option value="Andhra Pradesh">Andhra Pradesh</option>\n  <option value="Telangana">Telangana</option>\n  <option value="Maharashtra">Maharashtra</option>\n  <option value="Delhi">Delhi</option>\n  <option value="Other">Other</option>`;
    
    // Sometimes indentation differs, so let's use a regex
    const oldStateDropdownRegex = /<option value="Tamil Nadu">Tamil Nadu<\/option>[\s\S]*?<option value="Other">Other<\/option>/g;
    
    const newStateDropdown = `{INDIAN_STATES.map((s) => (\n    <option key={s} value={s}>{s}</option>\n  ))}`;
    content = content.replace(oldStateDropdownRegex, newStateDropdown);

    // 4. Update the District conditional rendering
    // From: {state === "Tamil Nadu" && !isOtherDistrict ? (
    // To: {getDistrictsForState(state).length > 0 && !isOtherDistrict ? (
    content = content.replace(/state === "Tamil Nadu" && !isOtherDistrict \? \(/g, 'getDistrictsForState(state).length > 0 && !isOtherDistrict ? (');

    // From: {TAMIL_NADU_DISTRICTS.map((d) => (
    // To: {getDistrictsForState(state).map((d) => (
    content = content.replace(/\{TAMIL_NADU_DISTRICTS\.map/g, '{getDistrictsForState(state).map');

    // 5. Update College conditional rendering (only in college/login)
    if (filePath.includes('college\\login')) {
        content = content.replace(/state === "Tamil Nadu" \? "Select College \/ University" : "Enter College \/ University Name"/g, 
            'getCollegesForState(state).length > 0 ? "Select College / University" : "Enter College / University Name"');
        
        content = content.replace(/state === "Tamil Nadu" \? \(/g, 'getCollegesForState(state).length > 0 ? (');
        
        content = content.replace(/\{COLLEGES_LIST\.map\(\(c\) => \(/g, '{getCollegesForState(state).map((c) => (');
    }

    // 6. Update Industry conditional rendering (only in industry/login)
    if (filePath.includes('industry\\login')) {
        content = content.replace(/state === "Tamil Nadu" \? "Company \/ Industry Name \(Autocomplete\)" : "Enter Company \/ Industry Name"/g, 
            'state === "Jharkhand" || state === "Tamil Nadu" ? "Company / Industry Name (Autocomplete)" : "Enter Company / Industry Name"');
        
        content = content.replace(/\{state === "Tamil Nadu" \? \(/g, '{state === "Jharkhand" || state === "Tamil Nadu" ? (');
        content = content.replace(/\{state === "Tamil Nadu" && <span/g, '{ (state === "Jharkhand" || state === "Tamil Nadu") && <span');
        content = content.replace(/\{state === "Tamil Nadu" && showSuggestions/g, '{ (state === "Jharkhand" || state === "Tamil Nadu") && showSuggestions');
    }

    // 7. Update Govt conditional rendering (only in govt/login)
    if (filePath.includes('government\\login')) {
        content = content.replace(/state === "Tamil Nadu" \? "Department \/ Authority Division" : "Enter Department \/ Authority Name"/g, 
            'state === "Jharkhand" || state === "Tamil Nadu" ? "Department / Authority Division" : "Enter Department / Authority Name"');
        
        content = content.replace(/\{state === "Tamil Nadu" \? \(/g, '{state === "Jharkhand" || state === "Tamil Nadu" ? (');
    }

    fs.writeFileSync(filePath, content);
    console.log(`Patched ${path.basename(filePath)}`);
}

filePaths.forEach(patchFile);
console.log("All done!");
