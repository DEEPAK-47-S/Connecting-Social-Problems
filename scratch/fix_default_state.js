const fs = require('fs');

const dataFile = "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\data\\indianStates.ts";
let dataContent = fs.readFileSync(dataFile, 'utf8');
dataContent = dataContent.replace(/"Jharkhand", \/\/ Default/g, '"Jharkhand",');
fs.writeFileSync(dataFile, dataContent);

const files = [
    "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\login\\page.tsx",
    "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\college\\login\\page.tsx",
    "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\industry\\login\\page.tsx",
    "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\government\\login\\page.tsx",
    "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\components\\CreatePostModal.tsx",
    "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\components\\EditPostModal.tsx"
];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Replace default useState("Jharkhand") with useState("")
        content = content.replace(/useState\("Jharkhand"\)/g, 'useState("")');
        content = content.replace(/useState\(post\?.state \|\| "Jharkhand"\)/g, 'useState(post?.state || "")');

        // Add Select State option
        const target = `{INDIAN_STATES.map((s) => (
    <option key={s} value={s}>{s}</option>
  ))}`;
        const repl = `<option value="" disabled>Select State</option>\n  {INDIAN_STATES.map((s) => (
    <option key={s} value={s}>{s}</option>
  ))}`;

        content = content.replace(target, repl);

        const target2 = `{INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}`;
        const repl2 = `<option value="" disabled>Select State</option>\n                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}`;
        content = content.replace(target2, repl2);

        // Gov login edge case
        const targetGov = `{INDIAN_STATES.map((s) => (
     <option key={s} value={s}>{s}</option>
   ))}`;
        const replGov = `<option value="" disabled>Select State</option>\n   {INDIAN_STATES.map((s) => (
     <option key={s} value={s}>{s}</option>
   ))}`;
        content = content.replace(targetGov, replGov);

        // Create/Edit Modals District edge case
        const targetDist1Target = `<option value="">Select State</option>\n  {INDIAN_STATES.map`;
        // Already replaced potentially, but let's just make sure district logic handles empty string gracefully
        // getDistrictsForState("") returns [] which falls back to text input or empty list
        
        fs.writeFileSync(file, content);
    }
}
console.log("State UI properly updated to common Select State!");
