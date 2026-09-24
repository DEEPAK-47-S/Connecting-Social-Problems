import { TAMIL_NADU_DISTRICTS } from "./tamilNaduDistricts";

export const STATE_DISTRICTS: Record<string, string[]> = {
  "Jharkhand": [
    "Ranchi", "Dhanbad", "Bokaro", "East Singhbhum (Jamshedpur)", "West Singhbhum", 
    "Hazaribagh", "Giridih", "Deoghar", "Ramgarh", "Palamu", "Garhwa", "Dumka",
    "Godda", "Jamtara", "Pakur", "Sahebganj", "Chatra", "Koderma", "Latehar",
    "Lohardaga", "Gumla", "Simdega", "Khunti", "Seraikela Kharsawan"
  ],
  "Tamil Nadu": [...TAMIL_NADU_DISTRICTS],
  "Kerala": [
    "Thiruvananthapuram", "Ernakulam", "Kozhikode", "Thrissur", "Malappuram", "Kannur",
    "Kollam", "Kottayam", "Palakkad", "Alappuzha", "Pathanamthitta", "Idukki", "Wayanad", "Kasaragod"
  ],
  "Karnataka": [
    "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Mangaluru (Dakshina Kannada)", 
    "Hubballi-Dharwad", "Belagavi", "Kalaburagi", "Ballari", "Tumakuru", "Udupi", "Shivamogga"
  ],
  "Andhra Pradesh": [
    "Visakhapatnam", "Vijayawada (NTR)", "Guntur", "Tirupati", "Nellore", "Kurnool",
    "Kadapa", "Anantapur", "Kakinada", "Rajahmundry", "Prakasam"
  ],
  "Telangana": [
    "Hyderabad", "Ranga Reddy", "Medchal-Malkajgiri", "Warangal", "Nizamabad",
    "Karimnagar", "Khammam", "Mahabubnagar", "Nalgonda", "Sangareddy"
  ],
  "Maharashtra": [
    "Mumbai City", "Mumbai Suburban", "Pune", "Nagpur", "Thane", "Nashik",
    "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Navi Mumbai", "Jalgaon"
  ],
  "Delhi": [
    "Central Delhi", "New Delhi", "North Delhi", "North West Delhi", "West Delhi",
    "South West Delhi", "South Delhi", "South East Delhi", "East Delhi", "North East Delhi", "Shahdara"
  ]
};

// Fallback for states not mapped explicitly above (or user can select "Others" and type manually)
export const getDistrictsForState = (state: string): string[] => {
  return STATE_DISTRICTS[state] || [];
};
