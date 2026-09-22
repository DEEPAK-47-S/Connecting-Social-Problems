"use client";

import {  useState, useEffect, useMemo, useRef  } from "react";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  CheckCircle2,
  Building,
  Sparkles,
  Search,
  Plus,
  MapPin,
  Check,
  ChevronDown,
  ShieldCheck
} from "lucide-react";
import { TAMIL_NADU_COLLEGES, TamilNaduCollege } from "@/data/tamilNaduColleges";
import { TAMIL_NADU_DISTRICTS } from "@/data/tamilNaduDistricts";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const COMMON_PROBLEM_SKILLS = [
  "Electricity & Power Grid",
  "Water Management & Purification",
  "Manufacturing & Heavy Engineering",
  "Infrastructure & Civil",
  "Automation & Robotics",
  "AI & Machine Learning",
  "IoT & Smart Sensors",
  "Renewable Energy & Solar",
  "Agriculture & Irrigation Tech",
  "Waste Recycling & Solid Waste",
  "Clean Transportation & EV",
  "Rural Development & Sanitation",
  "Healthcare & Biomedical",
  "Smart City & Traffic Systems"
];

export default function CollegeLoginPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  // Custom colleges from localStorage
  const [allColleges, setAllColleges] = useState<TamilNaduCollege[]>(TAMIL_NADU_COLLEGES);

  // Typing & Autocomplete state (Only for Registration)
  const [collegeQuery, setCollegeQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<TamilNaduCollege | null>(TAMIL_NADU_COLLEGES[0]);
  const [isNewCollege, setIsNewCollege] = useState(false);

  // Registration & Form details
  const [district, setDistrict] = useState("Chennai");
  const [collegeType, setCollegeType] = useState<TamilNaduCollege["type"]>("Engineering");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(TAMIL_NADU_COLLEGES[0].skills);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [leadDept, setLeadDept] = useState("R&D Innovation Lab");
  const [facultyName, setFacultyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load custom colleges on mount
  useEffect(() => {
    try {
      const storedCustom = localStorage.getItem("custom_colleges");
      if (storedCustom) {
        const parsed = JSON.parse(storedCustom);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAllColleges([...parsed, ...TAMIL_NADU_COLLEGES]);
        }
      }
    } catch {}
  }, []);

  // Filter suggestions as user types
  const suggestions = useMemo(() => {
    if (!collegeQuery.trim()) return allColleges.slice(0, 8);
    const q = collegeQuery.toLowerCase();
    return allColleges
      .filter((c) => c.name.toLowerCase().includes(q) || c.skills.some((s) => s.toLowerCase().includes(q)) || c.district.toLowerCase().includes(q))
      .slice(0, 8);
  }, [collegeQuery, allColleges]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle typing in college input
  const handleCollegeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCollegeQuery(val);
    setShowSuggestions(true);

    const exactMatch = allColleges.find((c) => c.name.toLowerCase() === val.trim().toLowerCase());
    if (exactMatch) {
      setSelectedCollege(exactMatch);
      setSelectedSkills(exactMatch.skills);
      setLeadDept(exactMatch.leadDept || "R&D Lab");
      if (exactMatch.district) setDistrict(exactMatch.district);
      if (exactMatch.type) setCollegeType(exactMatch.type);
      setIsNewCollege(false);
    } else {
      setSelectedCollege(null);
      setIsNewCollege(val.trim().length > 2);
    }
  };

  // Select suggestion
  const handleSelectSuggestion = (college: TamilNaduCollege) => {
    setSelectedCollege(college);
    setCollegeQuery(college.name);
    setSelectedSkills(college.skills);
    setLeadDept(college.leadDept || "R&D Lab");
    if (college.district) setDistrict(college.district);
    if (college.type) setCollegeType(college.type);
    setIsNewCollege(false);
    setShowSuggestions(false);
  };

  // Toggle problem skill
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Add custom skill
  const handleAddCustomSkill = () => {
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      setCustomSkillInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!isLogin) {
      const targetCollegeName = selectedCollege ? selectedCollege.name : collegeQuery.trim();
      if (!targetCollegeName) {
        setError("Please enter or select a college name.");
        return;
      }

      if (selectedSkills.length === 0) {
        setError("Please select at least one problem-solving skill / specialization for your institution.");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body: any = {
        email: email.trim().toLowerCase(),
        password,
      };
      
      const targetCollegeName = selectedCollege ? selectedCollege.name : collegeQuery.trim();

      if (isLogin) {
        body.expectedRole = "COLLEGE";
      } else {
        body.name = facultyName.trim() || `${targetCollegeName} Faculty Lead`;
        body.role = "UNIVERSITY";
      }

      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please check your credentials.");
      }

      // If it's a new registration, persist custom college to localStorage
      if (!isLogin) {
        if (isNewCollege || !selectedCollege) {
          const newCollegeObj: TamilNaduCollege = {
            name: targetCollegeName,
            district: district,
            skills: selectedSkills,
            leadDept: leadDept || "Engineering & Research Lab",
            type: collegeType,
          };

          const existingCustom = JSON.parse(localStorage.getItem("custom_colleges") || "[]");
          const filtered = existingCustom.filter((c: any) => c.name !== targetCollegeName);
          localStorage.setItem("custom_colleges", JSON.stringify([newCollegeObj, ...filtered]));
        }
      }

      // Match or retrieve existing college info if in login mode
      let activeCollegeInfo: any = selectedCollege;
      if (isLogin) {
        // Find if user already had a college or match from allColleges
        const matched = allColleges.find((c) => c.name.toLowerCase() === (data.user?.collegeName || "").toLowerCase());
        if (matched) activeCollegeInfo = matched;
      }

      const collegeUser = {
        ...data.user,
        collegeName: targetCollegeName || activeCollegeInfo?.name || data.user.collegeName || "Government College of Engineering, Salem",
        dept: leadDept || activeCollegeInfo?.leadDept || data.user.dept || "R&D Innovation Lab",
        skills: selectedSkills.length > 0 ? selectedSkills : activeCollegeInfo?.skills || ["Electricity", "Energy", "Manufacturing"],
        district: district || activeCollegeInfo?.district || "Salem",
        facultyName: facultyName || data.user.name || "Faculty Guide",
        role: "UNIVERSITY",
      };

      localStorage.setItem("college_token", data.token);
      localStorage.setItem("college_user", JSON.stringify(collegeUser));

      // Global auth sync
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(collegeUser));

      setSuccessMsg(isLogin ? "Welcome back! Opening R&D Portal..." : `Welcome, ${collegeUser.collegeName}! Registration successful.`);

      setTimeout(() => {
        router.push("/college");
        router.refresh();
      }, 700);
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 text-slate-100 p-4 selection:bg-indigo-500 selection: py-12 ${isDark ? "text-white" : "text-slate-900"}`}>
      <div className="w-full max-w-lg">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link
            href="/college"
            className={`inline-flex items-center gap-2 text-3xl font-black italic tracking-tight  group ${isDark ? "text-white" : "text-slate-900"}`}
          >
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className={`h-5 w-5 ${isDark ? "text-white" : "text-slate-900"}`} />
            </div>
            <span>SocialImpact</span>
          </Link>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Tamil Nadu Colleges &amp; Universities Innovation Portal</span>
          </div>
        </div>

        {/* Auth Card */}
        <div className={`/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800/80 overflow-hidden ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
          <div className="p-7 sm:p-9">

            {/* Tab Switcher */}
            <div className={`flex  p-1.5 rounded-2xl mb-6 border border-slate-800 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  isLogin
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In (Login)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  !isLogin
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Register New College
              </button>
            </div>

            <div className="mb-6">
              <h2 className={`text-xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                {isLogin ? "Academic Faculty Sign In" : "Register Your University / College"}
              </h2>
              <p className={`text-xs  mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {isLogin
                  ? "Enter your academic work email and password to access the college problem dashboard."
                  : "Fill in your institution details and registered problem-solving skills to adopt citizen problem statements."}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3.5 bg-rose-950/50 border border-rose-900/80 rounded-2xl text-rose-300 text-xs font-semibold flex items-center gap-2.5">
                <div className="h-4 w-4 rounded-full bg-rose-900 text-rose-200 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">!</div>
                <div>{error}</div>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="mb-5 p-3.5 bg-emerald-950/50 border border-emerald-900/80 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <div>{successMsg}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* ======================================================== */}
              {/* SIGN UP / REGISTRATION FIELDS ONLY (Hidden in Login Mode) */}
              {/* ======================================================== */}
              {!isLogin && (
                <>
                  {/* College Name Search / Autocomplete Field */}
                  <div ref={dropdownRef} className="relative">
                    <label className={`block text-[11px] font-bold uppercase tracking-wider  mb-1.5 flex items-center justify-between ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      <span>College Name (Smart Autocomplete)</span>
                      <span className="text-[10px] text-indigo-400 font-semibold">{allColleges.length}+ Tamil Nadu Colleges</span>
                    </label>

                    <div className="relative">
                      <Building className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        required={!isLogin}
                        value={collegeQuery}
                        onChange={handleCollegeInputChange}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Type to search or enter college name..."
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-950  placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium ${isDark ? "text-white" : "text-slate-900"}`}
                      />
                      <ChevronDown
                        className="absolute right-3.5 top-3 h-4 w-4 text-slate-500 cursor-pointer"
                        onClick={() => setShowSuggestions(!showSuggestions)}
                      />
                    </div>

                    {/* Live Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className={`absolute z-50 left-0 right-0 mt-1  border border-slate-700 rounded-2xl shadow-2xl max-h-56 overflow-y-auto divide-y divide-slate-800 animate-in fade-in ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                        {suggestions.map((c, i) => (
                          <div
                            key={i}
                            onClick={() => handleSelectSuggestion(c)}
                            className="p-3 hover:bg-slate-800/80 cursor-pointer transition flex items-start justify-between gap-2"
                          >
                            <div>
                              <p className={`text-xs font-bold  flex items-center gap-1.5 ${isDark ? "text-white" : "text-slate-900"}`}>
                                <span>{c.name}</span>
                                {c.district && (
                                  <span className="text-[9px] px-1.5 py-0.2 bg-purple-500/20 text-purple-300 rounded font-semibold">
                                    {c.district}
                                  </span>
                                )}
                                {c.type && (
                                  <span className="text-[9px] px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded font-semibold">
                                    {c.type}
                                  </span>
                                )}
                              </p>
                              <p className={`text-[10px]  mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                Specializations: {c.skills.slice(0, 3).join(", ")}
                              </p>
                            </div>
                            {selectedCollege?.name === c.name && (
                              <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            )}
                          </div>
                        ))}

                        {collegeQuery.trim() && !allColleges.some((c) => c.name.toLowerCase() === collegeQuery.trim().toLowerCase()) && (
                          <div
                            onClick={() => {
                              setIsNewCollege(true);
                              setShowSuggestions(false);
                            }}
                            className="p-3 bg-indigo-950/40 hover:bg-indigo-900/50 cursor-pointer transition flex items-center gap-2 text-xs font-bold text-indigo-300"
                          >
                            <Plus className="h-4 w-4 text-indigo-400" />
                            <span>Create and register new college: &quot;{collegeQuery}&quot;</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Detailed College Configuration */}
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Problem Solving Skills &amp; Institution Profile</span>
                      </span>
                      {isNewCollege && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold">
                          New Campus Setup
                        </span>
                      )}
                    </div>

                    {/* College Type & District */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className={`block text-[10px] font-bold  mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          Campus Type
                        </label>
                        <select
                          value={collegeType}
                          onChange={(e) => setCollegeType(e.target.value as TamilNaduCollege["type"])}
                          className={`w-full px-2.5 py-1.5 bg-slate-950 rounded-lg border border-slate-800 text-xs  focus:ring-2 focus:ring-indigo-500 outline-none ${isDark ? "text-white" : "text-slate-900"}`}
                        >
                          <option value="Engineering">Engineering &amp; Tech</option>
                          <option value="University">State / Central University</option>
                          <option value="Autonomous">Autonomous Institute</option>
                          <option value="Arts & Science">Arts &amp; Science</option>
                          <option value="Medical">Medical &amp; Healthcare</option>
                          <option value="Education">Education &amp; Polytechnic</option>
                        </select>
                      </div>

                      <div>
                        <label className={`block text-[10px] font-bold  mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          Tamil Nadu District
                        </label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className={`w-full px-2.5 py-1.5 bg-slate-950 rounded-lg border border-slate-800 text-xs  focus:ring-2 focus:ring-indigo-500 outline-none ${isDark ? "text-white" : "text-slate-900"}`}
                        >
                          {TAMIL_NADU_DISTRICTS.map((d) => (
                            <option key={d} value={d}>
                              {d} District
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Problem-Solving Specializations (Clickable Chips) */}
                    <div>
                      <label className={`block text-[10px] font-bold  mb-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Select Problem Areas This College Solves:
                      </label>
                      <div className={`flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 /60 rounded-xl border border-slate-800 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                        {COMMON_PROBLEM_SKILLS.map((skill, idx) => {
                          const isSelected = selectedSkills.includes(skill);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => toggleSkill(skill)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                                isSelected
                                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3" />}
                              <span>{skill}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Add Custom Skill */}
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={customSkillInput}
                          onChange={(e) => setCustomSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddCustomSkill();
                            }
                          }}
                          placeholder="Add custom problem skill..."
                          className={`flex-1 px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800  placeholder-slate-600 text-xs outline-none ${isDark ? "text-white" : "text-slate-900"}`}
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomSkill}
                          className={`px-3 py-1.5 bg-slate-800 hover:bg-slate-700  text-xs font-bold rounded-lg transition ${isDark ? "text-white" : "text-slate-900"}`}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Lead Department */}
                    <div>
                      <label className={`block text-[10px] font-bold  mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Lead Department / Center of Excellence
                      </label>
                      <input
                        type="text"
                        value={leadDept}
                        onChange={(e) => setLeadDept(e.target.value)}
                        placeholder="e.g. Dept of Electrical &amp; Water Systems Lab"
                        className={`w-full px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800  text-xs outline-none ${isDark ? "text-white" : "text-slate-900"}`}
                      />
                    </div>
                  </div>

                  {/* Faculty Guide / Coordinator */}
                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider  mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Faculty Guide / Principal Investigator Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        required={!isLogin}
                        value={facultyName}
                        onChange={(e) => setFacultyName(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950  placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium ${isDark ? "text-white" : "text-slate-900"}`}
                        placeholder="e.g. Dr. K. Ramanathan, Ph.D"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ======================================================== */}
              {/* CORE CREDENTIALS (Email & Password - Shown in Both Modes) */}
              {/* ======================================================== */}

              {/* Academic Email / Username */}
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider  mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {isLogin ? "Academic Work Email / Username" : "Official Academic Work Email"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950  placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium ${isDark ? "text-white" : "text-slate-900"}`}
                    placeholder="professor@university.edu.in"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider  mb-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-950  placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium ${isDark ? "text-white" : "text-slate-900"}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className={`absolute right-3.5 top-3  hover:text-slate-200 transition-colors ${isDark ? "text-slate-400" : "text-slate-600"}`}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600  font-bold rounded-xl hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 text-xs uppercase tracking-wider ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? "Sign In to Academic Hub" : "Complete College Registration"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800 text-center text-[11px] text-slate-500">
              <span className={`flex items-center justify-center gap-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
                <span>Authorized Tamil Nadu Academic &amp; Research Access Only</span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
