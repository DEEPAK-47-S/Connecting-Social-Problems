"use client";

import { useState, useRef } from "react";
import ImageCropper from "./ImageCropper";
import {
  X,
  Image as ImageIcon,
  Crop,
  MapPin,
  Tag,
  Loader2,
  AlertCircle,
  Navigation,
  Building,
  Compass,
  LocateFixed
} from "lucide-react";
import { TAMIL_NADU_DISTRICTS } from "@/data/tamilNaduDistricts";
import { INDIAN_STATES } from "@/data/indianStates";
import { getDistrictsForState } from "@/data/districts";


const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const CATEGORIES = [
  "Water Management",
  "Electricity & Power",
  "Roads & Transport",
  "Sanitation & Solid Waste",
  "Agriculture & Irrigation",
  "Healthcare & Clinics",
  "Smart City & Traffic",
  "Education & Schools",
  "Environment & Pollution",
  "Renewable Energy",
  "General / Other"
];

interface Props {
  onClose: () => void;
  onPosted: (post: any) => void;
}

export default function CreatePostModal({ onClose, onPosted }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Water Management");
  
  // Detailed Location States
  const [landmark, setLandmark] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [district, setDistrict] = useState("Chennai");
  const [state, setState] = useState("");
  const [isOtherDistrict, setIsOtherDistrict] = useState(false);
  const [pincode, setPincode] = useState("");
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [geoLocating, setGeoLocating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
            { headers: { 'User-Agent': 'ConnectingSocialProblems/1.0' } }
          );
          const data = await res.json();
          const addr = data.address || {};
          
          const detectedLandmark = addr.amenity || addr.tourism || addr.building || addr.shop || addr.road || "";
          const detectedStreet = [addr.house_number, addr.road].filter(Boolean).join(', ');
          const detectedArea = addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.city_district || "";
          const detectedDistrict = addr.county || addr.state_district || "";
          const detectedState = addr.state || "";
          const detectedPincode = addr.postcode || "";
          
          if (detectedLandmark) setLandmark(detectedLandmark);
          if (detectedStreet) setStreet(detectedStreet);
          if (detectedArea) setArea(detectedArea);
          if (detectedPincode) setPincode(detectedPincode.replace(/\D/g, "").slice(0, 6));

          let matchedState = "";
          if (detectedState) {
            matchedState = INDIAN_STATES.find(s => detectedState.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(detectedState.toLowerCase())) || "";
            if (matchedState) setState(matchedState);
          }
          
          if (detectedDistrict && matchedState) {
            const districtList = getDistrictsForState(matchedState);
            const matchDist = districtList.find(d => detectedDistrict.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(detectedDistrict.toLowerCase()));
            if (matchDist) setDistrict(matchDist);
            else {
              setIsOtherDistrict(true);
              setDistrict(detectedDistrict);
            }
          } else if (detectedDistrict) {
             setDistrict(detectedDistrict);
          }
        } catch {
          setError("Could not fetch address. Please fill location manually.");
        } finally {
          setGeoLocating(false);
        }
      },
      (err) => {
        setGeoLocating(false);
        if (err.code === 1) setError("Location permission denied. Please allow location access and try again.");
        else setError("Could not detect location. Please fill manually.");
      },
      { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
    );
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!title.trim() || !description.trim()) {
      setError("Please provide a title and detailed problem description.");
      return;
    }

    if (!landmark.trim() || !area.trim()) {
      setError("Please specify an accurate landmark and area so engineering teams can locate the ground issue.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be signed in to submit a complaint.");

      // Construct formatted accurate location string
      const locationParts = [
        landmark.trim() ? `Near ${landmark.trim()}` : "",
        street.trim(),
        area.trim(),
        `${district} District`,
        pincode.trim() ? `PIN: ${pincode.trim()}` : "",
        state
      ].filter(Boolean);

      const formattedLocation = locationParts.join(", ");

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("location", formattedLocation);
      formData.append("district", district);
      formData.append("state", state);
      if (image) formData.append("image", image);

      const res = await fetch(`${API}/api/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post complaint.");

      onPosted(data.post);
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting your complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-end p-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-zinc-900 dark:text-white">Raise a Citizen Complaint</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">AI-matched with Tamil Nadu engineering colleges &amp; industry CSR funds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-rose-700 dark:text-rose-300 text-xs font-semibold">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Problem Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Contaminated Drinking Water Pipeline in Ward 4"
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              maxLength={120}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Problem Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Accurate Ground Location Section */}
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 space-y-3">
          <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                <Navigation className="h-4 w-4 text-indigo-500" />
                <span>Accurate Ground Location Details</span>
              </div>
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={geoLocating}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded-xl text-[11px] font-bold transition shadow-md shadow-indigo-500/20"
              >
                {geoLocating ? <Loader2 className="h-3 w-3 animate-spin" /> : <LocateFixed className="h-3 w-3" />}
                <span>{geoLocating ? 'Detecting...' : 'Use My Location'}</span>
              </button>
            </div>

            {/* Accurate Ground Location Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
<div>
                <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  Accurate Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Anna Statue / Near Bus Stand"
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

<div>
                <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  Street / Road / Door No.
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. 5th Cross Street, Gandhi Road"
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

<div>
                <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  Area / Locality / Ward *
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Anna Nagar / Ward 12"
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

<div>
                <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  State *
                </label>
                <select
                  required
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setIsOtherDistrict(false);
                  }}
                  className="w-full px-2 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="" disabled>Select State</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

<div>
                <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  District *
                </label>
                {getDistrictsForState(state).length > 0 && !isOtherDistrict ? (
                <select
                  required
                  value={district}
                  onChange={(e) => {
                    if (e.target.value === "Others") {
                      setIsOtherDistrict(true);
                      setDistrict("");
                    } else {
                      setDistrict(e.target.value);
                    }
                  }}
                  className="w-full px-2 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {getDistrictsForState(state).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                  <option value="Others">Others (Type manually)</option>
                </select>
                ) : (
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Enter District Name"
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                )}
              </div>

<div>
                <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 600028"
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

            </div>
          </div>
          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Problem Description &amp; Details
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide complete ground details: How many people are affected? How long has this issue persisted? What specific technical or infrastructure help is needed?"
              rows={4}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-zinc-900 dark:text-white placeholder-zinc-400 resize-none transition text-xs leading-relaxed"
              maxLength={2000}
            />
            <p className="text-[10px] text-zinc-400 text-right mt-1">{description.length}/2000 characters</p>
          
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
            <ImageIcon className="h-4 w-4 text-indigo-500" />
            <span>{image ? "Change Photo" : "Attach Site Photo"}</span>
          </button>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => setCropImageSrc(imagePreview)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Crop className="h-4 w-4 text-indigo-500" />
                  <span>Crop Current Photo</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="text-zinc-900 dark:text-white hidden" onChange={handleImage} />
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
              <img src={imagePreview} alt="Problem Photo" className="w-full h-auto object-contain max-h-56 bg-black/5 dark:bg-black/20" />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading || !title.trim() || !description.trim() || !landmark.trim() || !area.trim()}
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-95 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-500/20 text-xs"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              <span>{loading ? "Publishing..." : "Submit Complaint"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>

      {cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          onCropComplete={(croppedFile: File, previewUrl: string) => {
            setImage(croppedFile);
            setImagePreview(previewUrl);
            setCropImageSrc(null);
          }}
          onCancel={() => setCropImageSrc(null)}
        />
      )}
    </>
  );
}
