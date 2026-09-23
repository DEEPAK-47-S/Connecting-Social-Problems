import os
import re

files = [
    r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\login\page.tsx",
    r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\college\login\page.tsx",
    r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\industry\login\page.tsx",
]

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. State Injection
    state_injection = """
  // OTP States
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccessMsg("A new OTP has been sent!");
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((c) => {
          if (c <= 1) clearInterval(timer);
          return c - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
"""
    if "const [step, setStep]" not in content:
        content = content.replace('const [loading, setLoading] = useState(false);', 'const [loading, setLoading] = useState(false);\n' + state_injection)

    # 2. Add step == 2 handling at the top of handleSubmit try block
    try_idx = content.find("try {", content.find("const handleSubmit"))
    
    step2_injection = """try {
      if (step === 2) {
        const res = await fetch(`${API}/api/auth/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, otp }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Invalid OTP.");

        if(window.location.pathname.includes('admin')) {
           localStorage.setItem("admin_token", data.token);
           localStorage.setItem("admin_user", JSON.stringify({...data.user, role: "ADMIN"}));
        } else {
           localStorage.setItem("token", data.token);
           localStorage.setItem("user", JSON.stringify(data.user));
        }
        setSuccessMsg("Verification successful! Redirecting...");
        setTimeout(() => {
          router.push(window.location.pathname.replace("/login", "") || "/");
          router.refresh();
        }, 700);
        return;
      }
"""
    if "if (step === 2)" not in content:
        content = content[:try_idx] + step2_injection + content[try_idx+5:]

    # 3. Handle step 1 requiresOtp
    res_ok_idx = content.find("if (!res.ok) {")
    if res_ok_idx != -1 and "data.requiresOtp" not in content:
        res_ok_end = content.find("}", res_ok_idx) + 1
        
        requires_otp_logic = """
      if (data.requiresOtp) {
        setUserId(data.userId);
        setStep(2);
        setSuccessMsg("OTP sent to your email.");
        setLoading(false);
        return;
      }
"""
        content = content[:res_ok_end] + requires_otp_logic + content[res_ok_end:]
        
    # 4. Wrap the form inner in step === 1
    form_match = re.search(r'<form onSubmit=\{handleSubmit\}.*?>([\s\S]*?)</form>', content)
    if form_match and "Enter OTP" not in content:
        inner_form = form_match.group(1)
        otp_ui = """
  {step === 1 ? (
    <>
      %s
    </>
  ) : (
    <>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
          Enter OTP
        </label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-xl tracking-[0.5em] focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-foreground font-mono"
          placeholder="••••••"
          maxLength={6}
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 font-bold text-xs uppercase tracking-wider hover:opacity-95 transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 text-white"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        <span>{loading ? "Verifying..." : "Verify OTP"}</span>
      </button>
      
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendCooldown > 0 || loading}
          className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline disabled:opacity-50 disabled:no-underline"
        >
          {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
        </button>
      </div>
    </>
  )}
""" % inner_form
        content = content.replace(inner_form, otp_ui)
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("OTP Registration UI injected successfully!")
