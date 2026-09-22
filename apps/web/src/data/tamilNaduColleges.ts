export interface TamilNaduCollege {
  name: string;
  district: string;
  skills: string[];
  type: "Engineering" | "Arts & Science" | "Medical" | "Education" | "University" | "Autonomous";
  leadDept?: string;
}

export const TAMIL_NADU_COLLEGES: TamilNaduCollege[] = [
  {
    name: "Government College of Engineering, Salem",
    district: "Salem",
    skills: ["Electricity","Energy","Manufacturing","Infrastructure","Water Management"],
    type: "Engineering",
    leadDept: "Electrical & Environmental Engineering"
  },
  {
    name: "Government College of Technology, Coimbatore",
    district: "Coimbatore",
    skills: ["Electricity","Manufacturing","Automation","Energy","Infrastructure"],
    type: "Engineering",
    leadDept: "Automation & Power Systems"
  },
  {
    name: "Government College of Engineering, Bargur",
    district: "Krishnagiri",
    skills: ["Electricity","Manufacturing","Energy","Infrastructure","Rural Development"],
    type: "Engineering",
    leadDept: "Rural Infrastructure & Energy Lab"
  },
  {
    name: "Hindusthan College of Engineering and Technology",
    district: "Coimbatore",
    skills: ["Manufacturing","Automation","Energy","Electricity","IoT"],
    type: "Engineering",
    leadDept: "IoT & Mechatronics Lab"
  },
  {
    name: "IFET College of Engineering",
    district: "Viluppuram",
    skills: ["Electricity","Electronics","Manufacturing","Energy","Infrastructure"],
    type: "Engineering",
    leadDept: "Electronics & Power Systems"
  },
  {
    name: "Indra Ganesan College of Engineering",
    district: "Tiruchirappalli",
    skills: ["Electricity","Electronics","Transportation","Infrastructure"],
    type: "Engineering",
    leadDept: "Civil & Transportation Tech"
  },
  {
    name: "JCT College of Engineering and Technology",
    district: "Coimbatore",
    skills: ["Manufacturing","Automation","Electricity","Energy"],
    type: "Engineering",
    leadDept: "Manufacturing & Automation"
  },
  {
    name: "Jeppiaar Institute of Technology",
    district: "Kanchipuram",
    skills: ["AI","Software","IoT","Electronics","Smart Infrastructure"],
    type: "Engineering",
    leadDept: "AI & Smart Systems Center"
  },
  {
    name: "Jerusalem College of Engineering",
    district: "Chennai",
    skills: ["AI","Software","Electronics","Smart City","Transportation"],
    type: "Engineering",
    leadDept: "Smart City & Telematics"
  },
  {
    name: "J.K.K. Nataraja College of Engineering and Technology",
    district: "Namakkal",
    skills: ["Manufacturing","Agriculture Technology","Energy","Electricity"],
    type: "Engineering",
    leadDept: "Agri-Tech & Renewable Energy"
  },
  {
    name: "K. Ramakrishnan College of Engineering",
    district: "Tiruchirappalli",
    skills: ["Manufacturing","Electronics","Electricity","Automation"],
    type: "Engineering",
    leadDept: "Robotics & Automation"
  },
  {
    name: "KPR Institute of Engineering and Technology",
    district: "Coimbatore",
    skills: ["Manufacturing","Energy","Automation","Agriculture Technology"],
    type: "Engineering",
    leadDept: "Energy & Agri-Automation"
  },
  {
    name: "Kamaraj College of Engineering & Technology",
    district: "Virudhunagar",
    skills: ["Electricity","Electronics","Energy","Infrastructure"],
    type: "Engineering",
    leadDept: "Renewable Power & Grid Infra"
  },
  {
    name: "KCG College of Technology",
    district: "Chennai",
    skills: ["AI","Software","Electronics","Transportation","Smart City"],
    type: "Engineering",
    leadDept: "Smart Mobility & AI Center"
  },
  {
    name: "K.L.N. College of Engineering",
    district: "Madurai",
    skills: ["Electronics","Electricity","Manufacturing","Energy"],
    type: "Engineering",
    leadDept: "Power Electronics & Energy Systems"
  },
  {
    name: "K.S. Rangasamy College of Technology",
    district: "Namakkal",
    skills: ["Manufacturing","Automation","Energy","Electricity"],
    type: "Engineering",
    leadDept: "Automation & Electrical Eng"
  },
  {
    name: "Karpagam College of Engineering",
    district: "Coimbatore",
    skills: ["AI","IoT","Manufacturing","Energy","Water Management"],
    type: "Engineering",
    leadDept: "IoT Sensors & Water Telemetry"
  },
  {
    name: "Kongu Engineering College",
    district: "Erode",
    skills: ["Manufacturing","Agriculture Technology","Energy","Water Management"],
    type: "Engineering",
    leadDept: "Water Management & Agri-Robotics"
  },
  {
    name: "Knowledge Institute of Technology",
    district: "Salem",
    skills: ["AI","Software","Electronics","Energy","Automation"],
    type: "Engineering",
    leadDept: "AI & Embedded Electronics"
  },
  {
    name: "Kumaraguru College of Technology",
    district: "Coimbatore",
    skills: ["Manufacturing","AI","Automation","Energy","Water Management"],
    type: "Engineering",
    leadDept: "Smart Manufacturing & Water Tech"
  },
  {
    name: "Loyola-ICAM College of Engineering and Technology",
    district: "Chennai",
    skills: ["AI","Software","Electronics","Smart City","Infrastructure"],
    type: "Engineering",
    leadDept: "Smart Infrastructure & AI"
  },
  {
    name: "M. Kumarasamy College of Engineering",
    district: "Karur",
    skills: ["Manufacturing","Electricity","Energy","Infrastructure"],
    type: "Engineering",
    leadDept: "Power & Civic Infrastructure"
  },
  {
    name: "Mahendra College of Engineering",
    district: "Salem",
    skills: ["Manufacturing","Automation","Electricity","Energy"],
    type: "Engineering",
    leadDept: "Electrical Systems & Automation"
  },
  {
    name: "Meenakshi Sundararajan Engineering College",
    district: "Chennai",
    skills: ["AI","Software","Electronics","Smart City","Infrastructure"],
    type: "Engineering",
    leadDept: "Smart City Infrastructure"
  },
  {
    name: "Mepco Schlenk Engineering College",
    district: "Virudhunagar",
    skills: ["Manufacturing","Electronics","Energy","Automation"],
    type: "Engineering",
    leadDept: "Mechatronics & Energy Research"
  },
  {
    name: "National Engineering College",
    district: "Thoothukudi",
    skills: ["Electronics","Electricity","Energy","Manufacturing"],
    type: "Engineering",
    leadDept: "Power Systems & Electronics"
  },
  {
    name: "Nehru Institute of Engineering and Technology",
    district: "Coimbatore",
    skills: ["AI","Software","IoT","Automation","Smart City"],
    type: "Engineering",
    leadDept: "IoT & Smart Cities Innovation"
  },
  {
    name: "Nehru Institute of Technology",
    district: "Coimbatore",
    skills: ["AI","Software","IoT","Manufacturing","Energy"],
    type: "Engineering",
    leadDept: "AI & Energy Systems"
  },
  {
    name: "NPR College of Engineering & Technology",
    district: "Dindigul",
    skills: ["Agriculture Technology","Manufacturing","Energy","Electronics"],
    type: "Engineering",
    leadDept: "AgriTech & Renewable Energy"
  },
  {
    name: "Panimalar Engineering College",
    district: "Chennai",
    skills: ["AI","Software","Electronics","Smart City","Transportation"],
    type: "Engineering",
    leadDept: "AI & Smart Transportation"
  },
  {
    name: "P.S.G. College of Technology",
    district: "Coimbatore",
    skills: ["Manufacturing","Electricity","Automation","Energy","Healthcare Technology"],
    type: "Engineering",
    leadDept: "Advanced Manufacturing & Biomedical Lab"
  },
  {
    name: "PSG Institute of Technology and Applied Research",
    district: "Coimbatore",
    skills: ["AI","IoT","Manufacturing","Energy","Agriculture Technology"],
    type: "Engineering",
    leadDept: "IoT Sensors & Precision Agri"
  },
  {
    name: "P.S.R. Engineering College",
    district: "Virudhunagar",
    skills: ["Electronics","Electricity","Manufacturing","Energy"],
    type: "Engineering",
    leadDept: "Electrical & Energy Systems"
  },
  {
    name: "PSN College of Engineering and Technology",
    district: "Tirunelveli",
    skills: ["Electricity","Electronics","Energy","Infrastructure"],
    type: "Engineering",
    leadDept: "Infrastructure & Renewable Power"
  },
  {
    name: "PSNA College of Engineering and Technology",
    district: "Dindigul",
    skills: ["AI","Manufacturing","Electronics","Energy","Smart Infrastructure"],
    type: "Engineering",
    leadDept: "Smart Infrastructure & Automation"
  },
  {
    name: "Prathyusha Engineering College",
    district: "Tiruvallur",
    skills: ["AI","Software","Electronics","IoT","Smart City"],
    type: "Engineering",
    leadDept: "IoT & Smart City Solutions"
  },
  {
    name: "Rajalakshmi Engineering College",
    district: "Kanchipuram",
    skills: ["AI","Software","Electronics","Energy","Transportation"],
    type: "Engineering",
    leadDept: "Clean Energy & Electric Mobility"
  },
  {
    name: "Rajalakshmi Institute of Technology",
    district: "Tiruvallur",
    skills: ["AI","Software","Electronics","IoT","Smart City"],
    type: "Engineering",
    leadDept: "AI & Connected Cities"
  },
  {
    name: "Ramco Institute of Technology",
    district: "Virudhunagar",
    skills: ["Manufacturing","Automation","Energy","Agriculture Technology"],
    type: "Engineering",
    leadDept: "Agri-Automation & Energy"
  },
  {
    name: "Rathinam Technical Campus",
    district: "Coimbatore",
    skills: ["AI","Software","IoT","Smart City","Digital Public Services"],
    type: "Engineering",
    leadDept: "Digital Public Services & IoT"
  },
  {
    name: "RMK Engineering College",
    district: "Tiruvallur",
    skills: ["AI","Electronics","Transportation","Energy","Infrastructure"],
    type: "Engineering",
    leadDept: "Transportation & Energy Tech"
  },
  {
    name: "R.M.K. College of Engineering and Technology",
    district: "Tiruvallur",
    skills: ["AI","Electronics","IoT","Smart Infrastructure"],
    type: "Engineering",
    leadDept: "Smart Infrastructure & IoT"
  },
  {
    name: "Rohini College of Engineering and Technology",
    district: "Kanyakumari",
    skills: ["Electricity","Electronics","Energy","Water Management"],
    type: "Engineering",
    leadDept: "Water Management & Energy Tech"
  },
  {
    name: "Saranathan College of Engineering",
    district: "Tiruchirappalli",
    skills: ["Manufacturing","Electronics","Energy","Infrastructure"],
    type: "Engineering",
    leadDept: "Civic Infrastructure & Electronics"
  },
  {
    name: "SNS College of Engineering",
    district: "Coimbatore",
    skills: ["AI","Software","IoT","Manufacturing"],
    type: "Engineering",
    leadDept: "Software & IoT Prototyping"
  },
  {
    name: "SNS College of Technology",
    district: "Coimbatore",
    skills: ["AI","Manufacturing","Automation","Energy"],
    type: "Engineering",
    leadDept: "Automation & AI Research"
  },
  {
    name: "Sona College of Technology",
    district: "Salem",
    skills: ["Manufacturing","Automation","Electronics","Energy"],
    type: "Engineering",
    leadDept: "Industrial Automation & Solar Tech"
  },
  {
    name: "Sri Sivasubramaniya Nadar College of Engineering",
    district: "Chengalpattu",
    skills: ["AI","Software","Electronics","Biotechnology","Smart City"],
    type: "Engineering",
    leadDept: "Biotech, AI & Smart Cities Lab"
  },
  {
    name: "Sri Krishna College of Technology",
    district: "Coimbatore",
    skills: ["AI","Software","Manufacturing","Energy","IoT"],
    type: "Engineering",
    leadDept: "AI & Green Energy Lab"
  },
  {
    name: "A. V. C. College (Autonomous), Mayiladuthurai",
    district: "Mayiladuthurai",
    skills: ["Education","Agriculture","Water Management","Rural Development","Environment"],
    type: "Arts & Science",
    leadDept: "Environmental Studies & Rural Agri"
  },
  {
    name: "A. Doraisamy Nadar Maragathavalli Ammal College for Women",
    district: "Nagapattinam",
    skills: ["Education","Rural Development","Women's Development","Public Services"],
    type: "Arts & Science",
    leadDept: "Social Sciences & Rural Community"
  },
  {
    name: "A. G. College of Arts and Science",
    district: "Coimbatore",
    skills: ["Education","Digital Literacy","Rural Development","Community Development"],
    type: "Arts & Science",
    leadDept: "Computer Science & Digital Literacy"
  },
  {
    name: "Aditanar College of Arts and Science",
    district: "Thoothukudi",
    skills: ["Education","Rural Development","Agriculture","Public Services"],
    type: "Arts & Science",
    leadDept: "Rural Agriculture & Social Dev"
  },
  {
    name: "Agurchand Manmull Jain College",
    district: "Chennai",
    skills: ["Education","Digital Services","Business","Waste Management","Community Development"],
    type: "Arts & Science",
    leadDept: "Environmental Science & Waste Mgmt"
  },
  {
    name: "Ambai Arts College",
    district: "Tirunelveli",
    skills: ["Education","Agriculture","Water Management","Rural Development"],
    type: "Arts & Science",
    leadDept: "Water Resources & Rural Dev"
  },
  {
    name: "APC Mahalaxmi College for Women",
    district: "Thoothukudi",
    skills: ["Education","Women's Development","Healthcare Awareness","Community Development"],
    type: "Arts & Science",
    leadDept: "Public Health & Social Welfare"
  },
  {
    name: "Arignar Anna College, Aralvaimozhi",
    district: "Kanyakumari",
    skills: ["Education","Rural Development","Agriculture","Environment"],
    type: "Arts & Science",
    leadDept: "Environmental Botany & Agriculture"
  },
  {
    name: "Arul Anandar College",
    district: "Madurai",
    skills: ["Education","Rural Development","Agriculture","Community Development"],
    type: "Arts & Science",
    leadDept: "Rural Development Sciences"
  },
  {
    name: "Arulmigu Palani Andavar Arts College for Women",
    district: "Dindigul",
    skills: ["Education","Women's Development","Tourism","Rural Development"],
    type: "Arts & Science",
    leadDept: "Tourism & Community Development"
  },
  {
    name: "Arulmigu Palaniandavar College of Arts and Culture",
    district: "Dindigul",
    skills: ["Education","Tourism","Rural Development","Environment"],
    type: "Arts & Science",
    leadDept: "Heritage, Tourism & Ecology"
  },
  {
    name: "Arumugam Pillai Seethai Ammal College",
    district: "Sivaganga",
    skills: ["Education","Rural Development","Agriculture","Water Management"],
    type: "Arts & Science",
    leadDept: "Water Management & Agriculture"
  },
  {
    name: "Auxilium College",
    district: "Vellore",
    skills: ["Education","Women's Development","Healthcare Awareness","Community Development"],
    type: "Arts & Science",
    leadDept: "Community Health & Women Welfare"
  },
  {
    name: "Ayya Nadar Janaki Ammal College",
    district: "Virudhunagar",
    skills: ["Education","Technology","Manufacturing","Environment","Digital Services"],
    type: "Arts & Science",
    leadDept: "Chemistry & Environmental Technology"
  },
  {
    name: "Bishop Heber College",
    district: "Tiruchirappalli",
    skills: ["Education","Healthcare Awareness","Environment","Community Development","Digital Services"],
    type: "Arts & Science",
    leadDept: "Environmental Sciences & Social Work"
  },
  {
    name: "C. Abdul Hakeem College",
    district: "Ranipet",
    skills: ["Education","Rural Development","Digital Literacy","Employment"],
    type: "Arts & Science",
    leadDept: "Skill Development & Digital Literacy"
  },
  {
    name: "C. Kandaswami Naidu College for Men",
    district: "Chennai",
    skills: ["Education","Digital Services","Employment","Public Services"],
    type: "Arts & Science",
    leadDept: "Public Policy & Computer Science"
  },
  {
    name: "C. Kandaswami Naidu College for Women",
    district: "Cuddalore",
    skills: ["Education","Women's Development","Healthcare Awareness","Digital Literacy"],
    type: "Arts & Science",
    leadDept: "Health Science & Digital Literacy"
  },
  {
    name: "Cardamom Planters Association College",
    district: "Theni",
    skills: ["Agriculture","Plantation Development","Rural Development","Water Management"],
    type: "Arts & Science",
    leadDept: "Plantation & Agro-Water Studies"
  },
  {
    name: "CBM College",
    district: "Coimbatore",
    skills: ["Education","Rural Development","Digital Literacy","Community Development"],
    type: "Arts & Science",
    leadDept: "Community Development & IT"
  },
  {
    name: "Alagappa Government Arts College",
    district: "Sivaganga",
    skills: ["Education","Rural Development","Digital Services","Environment"],
    type: "Arts & Science",
    leadDept: "Rural Ecology & Digital Services"
  },
  {
    name: "Arignar Anna Government Arts College, Namakkal",
    district: "Namakkal",
    skills: ["Education","Agriculture","Rural Development","Public Services"],
    type: "Arts & Science",
    leadDept: "Agriculture & Rural Public Services"
  },
  {
    name: "Arignar Anna Government Arts College, Musiri",
    district: "Tiruchirappalli",
    skills: ["Education","Agriculture","Water Management","Rural Development"],
    type: "Arts & Science",
    leadDept: "Water Management & Agronomy"
  },
  {
    name: "Arignar Anna Government Arts College, Cheyyar",
    district: "Tiruvannamalai",
    skills: ["Education","Agriculture","Water Management","Rural Development"],
    type: "Arts & Science",
    leadDept: "Rural Water Resources"
  },
  {
    name: "Arignar Anna Government Arts College, Villupuram",
    district: "Viluppuram",
    skills: ["Education","Agriculture","Rural Development","Water Management"],
    type: "Arts & Science",
    leadDept: "Agri Sciences & Rural Tech"
  },
  {
    name: "Arignar Anna Government Arts College for Women, Walajapet",
    district: "Ranipet",
    skills: ["Education","Women's Development","Rural Development","Digital Literacy"],
    type: "Arts & Science",
    leadDept: "Women Empowerment & IT"
  },
  {
    name: "Arignar Anna Government Arts College, Attur",
    district: "Salem",
    skills: ["Education","Agriculture","Rural Development","Water Management"],
    type: "Arts & Science",
    leadDept: "Rural Ecology & Watershed"
  },
  {
    name: "Arulmigu Subramaniaswamy Government Arts College, Tiruttani",
    district: "Tiruvallur",
    skills: ["Education","Tourism","Rural Development","Environment"],
    type: "Arts & Science",
    leadDept: "Ecology & Tourism"
  },
  {
    name: "Bharat Ratna Dr. A.P.J. Abdul Kalam Government Arts and Science College",
    district: "Ramanathapuram",
    skills: ["Education","Coastal Development","Fisheries","Environment","Tourism"],
    type: "Arts & Science",
    leadDept: "Marine Biology & Coastal Ecology"
  },
  {
    name: "Bharat Ratna Puratchi Thalaivar Dr. M.G.R. Government Arts and Science College",
    district: "Tiruvarur",
    skills: ["Education","Agriculture","Rural Development","Water Management"],
    type: "Arts & Science",
    leadDept: "Rural Agriculture & Water Resources"
  },
  {
    name: "Bharathi Women's College",
    district: "Chennai",
    skills: ["Education","Women's Development","Healthcare Awareness","Digital Literacy"],
    type: "Arts & Science",
    leadDept: "Biochemistry & Public Health"
  },
  {
    name: "Chikkanna Government Arts College",
    district: "Tiruppur",
    skills: ["Education","Textile","Manufacturing","Waste Management","Employment"],
    type: "Arts & Science",
    leadDept: "Textile Chemistry & Waste Recycling"
  },
  {
    name: "Dharmapuram Gnanambigai Government Arts College for Women",
    district: "Mayiladuthurai",
    skills: ["Education","Women's Development","Rural Development","Healthcare Awareness"],
    type: "Arts & Science",
    leadDept: "Social Health & Women Studies"
  },
  {
    name: "Dr. Ambedkar Government Arts College",
    district: "Chennai",
    skills: ["Education","Social Development","Digital Literacy","Public Services"],
    type: "Arts & Science",
    leadDept: "Social Work & Public Policy"
  },
  {
    name: "Dr. Kalaignar Government Arts College, Kulithalai",
    district: "Karur",
    skills: ["Education","Agriculture","Water Management","Rural Development"],
    type: "Arts & Science",
    leadDept: "Cauvery Watershed & Agriculture"
  },
  {
    name: "Dr. M.G.R. Government Arts and Science College for Women",
    district: "Viluppuram",
    skills: ["Education","Women's Development","Rural Development","Healthcare Awareness"],
    type: "Arts & Science",
    leadDept: "Community Health & Rural Education"
  },
  {
    name: "Dr. Puratchi Thalaivar M.G.R. Government Arts and Science College",
    district: "Kanchipuram",
    skills: ["Education","Agriculture","Rural Development","Environment"],
    type: "Arts & Science",
    leadDept: "Agronomy & Environmental Science"
  },
  {
    name: "Government Arts and Science College, Perumbakkam",
    district: "Chengalpattu",
    skills: ["Education","Urban Development","Digital Services","Public Services"],
    type: "Arts & Science",
    leadDept: "Urban Governance & Digital Systems"
  },
  {
    name: "Government Arts and Science College, Mettupalayam",
    district: "Coimbatore",
    skills: ["Education","Agriculture","Water Management","Rural Development"],
    type: "Arts & Science",
    leadDept: "Agro-Forestry & Water Resources"
  },
  {
    name: "Government Arts and Science College, Sathyamangalam",
    district: "Erode",
    skills: ["Agriculture","Forest Environment","Rural Development","Water Management"],
    type: "Arts & Science",
    leadDept: "Forest Conservation & Tribal Development"
  },
  {
    name: "Government Arts and Science College, Kangeyam",
    district: "Tiruppur",
    skills: ["Agriculture","Water Management","Rural Development","Renewable Energy"],
    type: "Arts & Science",
    leadDept: "Agri-Renewable Energy & Water"
  },
  {
    name: "Government Arts and Science College, Hosur",
    district: "Krishnagiri",
    skills: ["Manufacturing","Industrial Development","Digital Services","Employment"],
    type: "Arts & Science",
    leadDept: "Industrial Economy & Digital Technology"
  },
  {
    name: "Government Arts and Science College, Komarapalayam",
    district: "Namakkal",
    skills: ["Textile","Manufacturing","Water Management","Waste Management"],
    type: "Arts & Science",
    leadDept: "Textile Effluent Treatment & Waste"
  },
  {
    name: "Government Arts and Science College, Tiruchuli",
    district: "Virudhunagar",
    skills: ["Agriculture","Rural Development","Water Management","Education"],
    type: "Arts & Science",
    leadDept: "Dryland Agriculture & Water Catchment"
  },
  {
    name: "Government Arts and Science College, Tirukozhilur",
    district: "Kallakurichi",
    skills: ["Agriculture","Rural Development","Water Management","Education"],
    type: "Arts & Science",
    leadDept: "Rural Agronomy & Water Conservation"
  },
  {
    name: "H.H. The Rajah's College, Pudukkottai",
    district: "Pudukkottai",
    skills: ["Education","Agriculture","Rural Development","Heritage","Environment"],
    type: "Arts & Science",
    leadDept: "Botany & Environmental Heritage"
  },
  {
    name: "Kalaignar Karunanidhi Government Arts College for Women",
    district: "Pudukkottai",
    skills: ["Education","Women's Development","Rural Development","Healthcare Awareness"],
    type: "Arts & Science",
    leadDept: "Women Health & Community Dev"
  },
  {
    name: "Kalaignar Karunanithi Government Arts College",
    district: "Tiruvannamalai",
    skills: ["Education","Agriculture","Rural Development","Environment"],
    type: "Arts & Science",
    leadDept: "Environmental Studies & Rural Agri"
  },
  {
    name: "Kamarajar Government Arts College, Surandai",
    district: "Tenkasi",
    skills: ["Agriculture","Rural Development","Water Management","Education"],
    type: "Arts & Science",
    leadDept: "Agricultural Water Management"
  },
  {
    name: "Kunthavai Nachiar Government Arts College for Women",
    district: "Thanjavur",
    skills: ["Education","Women's Development","Agriculture","Rural Development"],
    type: "Arts & Science",
    leadDept: "Rural Agricultural Sciences"
  },
  {
    name: "Loganatha Narayanaswamy Government Arts College",
    district: "Tiruvallur",
    skills: ["Education","Coastal Development","Agriculture","Water Management"],
    type: "Arts & Science",
    leadDept: "Coastal Water Resources & Botany"
  },
  {
    name: "LRG Government Arts College for Women",
    district: "Tiruppur",
    skills: ["Education","Women's Development","Textile","Employment"],
    type: "Arts & Science",
    leadDept: "Textile Design & Women Employment"
  },
  {
    name: "A.D.M. College for Women",
    district: "Nagapattinam",
    skills: ["Education","Women's Development","Rural Development","Healthcare Awareness"],
    type: "Arts & Science",
    leadDept: "Community Health & Rural Dev"
  },
  {
    name: "A.K.T. Memorial College of Engineering and Technology",
    district: "Kallakurichi",
    skills: ["Manufacturing","Electricity","Electronics","Energy","Infrastructure"],
    type: "Engineering",
    leadDept: "Electrical & Civil Infrastructure"
  },
  {
    name: "A.R.C. Viswanathan College",
    district: "Mayiladuthurai",
    skills: ["Education","Agriculture","Rural Development","Digital Literacy"],
    type: "Arts & Science",
    leadDept: "Agricultural Studies & Digital Literacy"
  },
  {
    name: "A.A. Government Arts College",
    district: "Tiruvannamalai",
    skills: ["Education","Agriculture","Rural Development","Water Management"],
    type: "Arts & Science",
    leadDept: "Water Catchment & Agronomy"
  },
  {
    name: "A.V.S. College of Arts and Science",
    district: "Salem",
    skills: ["Education","Digital Literacy","Agriculture","Rural Development"],
    type: "Arts & Science",
    leadDept: "Computer Applications & Agri-Studies"
  },
  {
    name: "A.V.P. College of Arts and Science",
    district: "Tiruppur",
    skills: ["Education","Digital Services","Rural Development","Waste Management"],
    type: "Arts & Science",
    leadDept: "Environmental Waste & IT"
  },
  {
    name: "Adhiparasakthi College of Arts and Science",
    district: "Ranipet",
    skills: ["Education","Healthcare Awareness","Rural Development","Women's Development"],
    type: "Arts & Science",
    leadDept: "Public Health & Social Dev"
  },
  {
    name: "Adhiyamaan College of Engineering",
    district: "Krishnagiri",
    skills: ["AI","Electronics","Manufacturing","Automation","Energy","Smart Infrastructure"],
    type: "Engineering",
    leadDept: "AI & Smart Manufacturing"
  },
  {
    name: "Adhiyamaan Arts and Science College",
    district: "Krishnagiri",
    skills: ["Education","Digital Literacy","Rural Development","Agriculture"],
    type: "Arts & Science",
    leadDept: "Rural Agronomy & Computing"
  },
  {
    name: "Amet University",
    district: "Chengalpattu",
    skills: ["Marine Technology","Coastal Development","Fisheries","Transportation","Environment"],
    type: "University",
    leadDept: "Ocean Engineering & Marine Tech"
  },
  {
    name: "Anand Institute of Higher Technology",
    district: "Chengalpattu",
    skills: ["AI","Software","Electronics","IoT","Smart City"],
    type: "Engineering",
    leadDept: "IoT Sensors & Smart Cities"
  },
  {
    name: "Anand Agricultural College",
    district: "Coimbatore",
    skills: ["Agriculture","Irrigation","Soil Management","Rural Development","Food Technology"],
    type: "Arts & Science",
    leadDept: "Irrigation & Soil Biotechnology"
  },
  {
    name: "Anand Institute of Engineering and Technology",
    district: "Chengalpattu",
    skills: ["Electricity","Electronics","Manufacturing","Automation","Energy"],
    type: "Engineering",
    leadDept: "Electrical Power & Automation"
  },
  {
    name: "Annai College of Engineering and Technology",
    district: "Thanjavur",
    skills: ["Electricity","Electronics","Manufacturing","Infrastructure"],
    type: "Engineering",
    leadDept: "Civic Infrastructure & Power"
  },
  {
    name: "Annai Fathima College of Arts and Science",
    district: "Madurai",
    skills: ["Education","Rural Development","Women's Development","Digital Literacy"],
    type: "Arts & Science",
    leadDept: "Women Studies & Digital Literacy"
  },
  {
    name: "Annai Hajira Women's College",
    district: "Tirunelveli",
    skills: ["Education","Women's Development","Healthcare Awareness","Rural Development"],
    type: "Arts & Science",
    leadDept: "Healthcare & Women Empowerment"
  },
  {
    name: "Annai Mathammal Sheela Engineering College",
    district: "Namakkal",
    skills: ["Manufacturing","Electricity","Electronics","Energy"],
    type: "Engineering",
    leadDept: "Electrical & Energy Engineering"
  },
  {
    name: "Annai Vailankanni College of Engineering",
    district: "Kanyakumari",
    skills: ["Electronics","Electricity","Automation","Infrastructure"],
    type: "Engineering",
    leadDept: "Infrastructure Automation"
  },
  {
    name: "Annai Vailankanni College for Women",
    district: "Chennai",
    skills: ["Education","Women's Development","Healthcare Awareness","Digital Literacy"],
    type: "Arts & Science",
    leadDept: "Community Health & IT"
  },
  {
    name: "Anjalai Ammal Mahalingam Engineering College",
    district: "Tiruvarur",
    skills: ["Manufacturing","Electronics","Energy","Automation"],
    type: "Engineering",
    leadDept: "Energy Systems & Automation"
  },
  {
    name: "Annai Velankanni College of Engineering",
    district: "Kanyakumari",
    skills: ["Electronics","Electricity","IoT","Energy"],
    type: "Engineering",
    leadDept: "IoT & Energy Telemetry"
  },
  {
    name: "Arasu Engineering College",
    district: "Thanjavur",
    skills: ["Manufacturing","Electricity","Electronics","Infrastructure"],
    type: "Engineering",
    leadDept: "Infrastructure & Mechanical Eng"
  },
  {
    name: "Aravindar Arts and Science College",
    district: "Viluppuram",
    skills: ["Education","Agriculture","Environment","Digital Literacy"],
    type: "Arts & Science",
    leadDept: "Ecology & Agri Studies"
  },
  {
    name: "Ariyalur Engineering College",
    district: "Ariyalur",
    skills: ["Infrastructure","Water Management","Energy","Manufacturing"],
    type: "Engineering",
    leadDept: "Water Management & Civil Infra"
  },
  {
    name: "Ariyur Engineering College",
    district: "Vellore",
    skills: ["Manufacturing","Electricity","Infrastructure","Automation"],
    type: "Engineering",
    leadDept: "Civil Infrastructure & Power"
  },
  {
    name: "Arunai Engineering College",
    district: "Tiruvannamalai",
    skills: ["Manufacturing","Electronics","Energy","Automation"],
    type: "Engineering",
    leadDept: "Solar Energy & Mechatronics"
  },
  {
    name: "Arunachala College of Engineering for Women",
    district: "Kanyakumari",
    skills: ["Electricity","Electronics","Energy","Infrastructure"],
    type: "Engineering",
    leadDept: "Power Systems & Energy Lab"
  },
  {
    name: "Asian College of Engineering and Technology",
    district: "Coimbatore",
    skills: ["Manufacturing","Electronics","Electricity","Automation"],
    type: "Engineering",
    leadDept: "Robotics & Industrial Automation"
  },
  {
    name: "A.V.C. College of Engineering",
    district: "Mayiladuthurai",
    skills: ["Electronics","Electricity","Energy","Infrastructure"],
    type: "Engineering",
    leadDept: "Energy Systems & Infrastructure"
  },
  {
    name: "A.V.S. Engineering College",
    district: "Salem",
    skills: ["Manufacturing","Electronics","Energy","Automation"],
    type: "Engineering",
    leadDept: "Automation & Clean Energy"
  },
  {
    name: "Bannari Amman Institute of Technology",
    district: "Erode",
    skills: ["AI","Manufacturing","Automation","Energy","Agriculture Technology"],
    type: "Engineering",
    leadDept: "AgriTech & AI Center of Excellence"
  },
  {
    name: "Bharath Institute of Higher Education and Research",
    district: "Chennai",
    skills: ["AI","Healthcare Technology","Energy","Infrastructure","Smart City"],
    type: "University",
    leadDept: "Biomedical & Smart City Center"
  },
  {
    name: "Bharath University",
    district: "Chennai",
    skills: ["AI","Healthcare Technology","Energy","Transportation","Smart Infrastructure"],
    type: "University",
    leadDept: "Transportation & Medical AI Lab"
  },
  {
    name: "Bharathidasan Institute of Management",
    district: "Tiruchirappalli",
    skills: ["Public Services","Rural Development","Business","Employment"],
    type: "University",
    leadDept: "Public Governance & Social Policy"
  },
  {
    name: "Bharathidasan University",
    district: "Tiruchirappalli",
    skills: ["Education","AI","Environment","Rural Development","Public Services"],
    type: "University",
    leadDept: "Environmental Science & Remote Sensing"
  },
  {
    name: "Bharathiar University",
    district: "Coimbatore",
    skills: ["Education","AI","Environment","Digital Services","Social Development"],
    type: "University",
    leadDept: "Environmental Sciences & AI"
  },
  {
    name: "Bharathiyar University Arts and Science College",
    district: "Nilgiris",
    skills: ["Education","Rural Development","Digital Literacy","Environment"],
    type: "Arts & Science",
    leadDept: "Ecology & Rural Development"
  },
  {
    name: "B.S. Abdur Rahman Crescent Institute of Science and Technology",
    district: "Chengalpattu",
    skills: ["AI","Software","Energy","Smart City","Infrastructure"],
    type: "University",
    leadDept: "Smart Cities & Green Energy Research"
  },
  {
    name: "Bharath Niketan Engineering College",
    district: "Theni",
    skills: ["Manufacturing","Electronics","Electricity","Energy"],
    type: "Engineering",
    leadDept: "Electrical Power & Mechanical Eng"
  },
  {
    name: "B.S. Anangpuria Institute of Technology",
    district: "Chennai",
    skills: ["Electronics","Manufacturing","Energy","Automation"],
    type: "Engineering",
    leadDept: "Manufacturing Automation"
  },
  {
    name: "C.A.R.E. School of Engineering",
    district: "Tiruchirappalli",
    skills: ["AI","Software","Electronics","Smart Infrastructure"],
    type: "Engineering",
    leadDept: "Smart Infrastructure Lab"
  },
  {
    name: "C.K. College of Engineering and Technology",
    district: "Cuddalore",
    skills: ["Electricity","Electronics","Manufacturing","Energy"],
    type: "Engineering",
    leadDept: "Energy Systems & Power Lab"
  },
  {
    name: "C.M.S. College of Engineering",
    district: "Namakkal",
    skills: ["Manufacturing","Electronics","Electricity","Automation"],
    type: "Engineering",
    leadDept: "Industrial Automation"
  },
  {
    name: "C.S.I. Ewart Women's Christian College",
    district: "Chengalpattu",
    skills: ["Education","Women's Development","Healthcare Awareness","Community Development"],
    type: "Arts & Science",
    leadDept: "Public Health & Women Welfare"
  },
  {
    name: "C.S.I. Bishop Appasamy College of Arts and Science",
    district: "Coimbatore",
    skills: ["Education","Healthcare Awareness","Digital Literacy","Social Development"],
    type: "Arts & Science",
    leadDept: "Social Work & Health Education"
  },
  {
    name: "C.S.I. Jayaraj Annapackiam College",
    district: "Thoothukudi",
    skills: ["Education","Rural Development","Women's Development","Healthcare Awareness"],
    type: "Arts & Science",
    leadDept: "Rural Health & Social Dev"
  },
  {
    name: "C.S.I. Kalyani Multi-purpose College",
    district: "Chennai",
    skills: ["Education","Digital Literacy","Community Development","Public Services"],
    type: "Arts & Science",
    leadDept: "Community Development & IT"
  },
  {
    name: "C.S.I. College of Engineering",
    district: "Nilgiris",
    skills: ["Electricity","Electronics","Energy","Infrastructure"],
    type: "Engineering",
    leadDept: "Energy & Civic Infrastructure"
  },
  {
    name: "C.S.I. College of Arts and Science",
    district: "Madurai",
    skills: ["Education","Digital Literacy","Rural Development","Healthcare Awareness"],
    type: "Arts & Science",
    leadDept: "Rural Community Health"
  },
  {
    name: "Cauvery College for Women",
    district: "Tiruchirappalli",
    skills: ["Education","Women's Development","Rural Development","Healthcare Awareness"],
    type: "Arts & Science",
    leadDept: "Biotechnology & Healthcare"
  },
  {
    name: "Chendhuran College of Engineering and Technology",
    district: "Pudukkottai",
    skills: ["Manufacturing","Electronics","Energy","Automation"],
    type: "Engineering",
    leadDept: "Renewable Energy & Automation"
  },
  {
    name: "Chettinad Academy of Research and Education",
    district: "Chengalpattu",
    skills: ["Healthcare","Biotechnology","Medical Technology","Environment"],
    type: "Medical",
    leadDept: "Biomedical & Clinical Research"
  },
  {
    name: "Chettinad College of Engineering and Technology",
    district: "Karur",
    skills: ["Manufacturing","Electronics","Energy","Infrastructure"],
    type: "Engineering",
    leadDept: "Infrastructure & Energy Tech"
  },
  {
    name: "Chettinad College of Arts and Science",
    district: "Tiruchirappalli",
    skills: ["Education","Digital Literacy","Rural Development","Healthcare Awareness"],
    type: "Arts & Science",
    leadDept: "Healthcare Studies & IT"
  },
  {
    name: "Chennai Institute of Technology",
    district: "Chennai",
    skills: ["AI","Software","Electronics","Manufacturing","IoT"],
    type: "Engineering",
    leadDept: "Center for Artificial Intelligence & IoT"
  },
  {
    name: "Chennai Mathematical Institute",
    district: "Chengalpattu",
    skills: ["Mathematics","AI","Data Science","Algorithms","Digital Technology"],
    type: "University",
    leadDept: "Theoretical Computer Science & AI"
  },
  {
    name: "Chennai National College",
    district: "Chennai",
    skills: ["Education","Digital Literacy","Business","Community Development"],
    type: "Arts & Science",
    leadDept: "Commerce & Community Studies"
  },
  {
    name: "Christ University, Chennai Campus",
    district: "Chengalpattu",
    skills: ["Education","AI","Business","Social Development","Digital Services"],
    type: "University",
    leadDept: "Data Science & Social Innovation"
  },
  {
    name: "Christian College of Engineering and Technology",
    district: "Dindigul",
    skills: ["Electricity","Electronics","Manufacturing","Energy"],
    type: "Engineering",
    leadDept: "Power Systems & Electronics"
  },
  {
    name: "Coimbatore Institute of Engineering and Technology",
    district: "Coimbatore",
    skills: ["Manufacturing","Energy","Electronics","Automation"],
    type: "Engineering",
    leadDept: "Automation & Clean Energy"
  },
  {
    name: "Dhanalakshmi Srinivasan College of Engineering",
    district: "Coimbatore",
    skills: ["AI","Electronics","Manufacturing","Energy"],
    type: "Engineering",
    leadDept: "AI & Electrical Engineering"
  },
  {
    name: "Dhanalakshmi Srinivasan Engineering College",
    district: "Perambalur",
    skills: ["AI","Software","Electronics","Manufacturing"],
    type: "Engineering",
    leadDept: "Software Engineering & Robotics"
  },
  {
    name: "Dhanalakshmi Srinivasan Medical College and Hospital",
    district: "Perambalur",
    skills: ["Healthcare","Rural Healthcare","Medical Technology","Public Health"],
    type: "Medical",
    leadDept: "Community Medicine & Public Health"
  },
  {
    name: "Dhaanish Ahmed College of Engineering",
    district: "Chengalpattu",
    skills: ["AI","Electronics","Manufacturing","Energy"],
    type: "Engineering",
    leadDept: "Renewable Energy & Embedded Systems"
  },
  {
    name: "Dr. M.G.R. Educational and Research Institute",
    district: "Chennai",
    skills: ["Healthcare","AI","Engineering","Energy","Smart City"],
    type: "University",
    leadDept: "Smart Cities & Biomedical Tech"
  },
  {
    name: "Dr. N.G.P. Institute of Technology",
    district: "Coimbatore",
    skills: ["AI","Manufacturing","Electronics","Healthcare Technology"],
    type: "Engineering",
    leadDept: "Biomedical Instrumentation & AI"
  },
  {
    name: "Dr. N.G.P. Arts and Science College",
    district: "Coimbatore",
    skills: ["Education","Healthcare Awareness","Digital Services","Biotechnology"],
    type: "Arts & Science",
    leadDept: "Biotechnology & Public Health"
  },
  {
    name: "Dr. Mahalingam College of Engineering and Technology",
    district: "Coimbatore",
    skills: ["Manufacturing","Energy","Automation","Agriculture Technology"],
    type: "Engineering",
    leadDept: "Automotive & Agri-Mechanization"
  },
  {
    name: "Dr. Pauls Engineering College",
    district: "Viluppuram",
    skills: ["Electronics","Electricity","Manufacturing","Energy"],
    type: "Engineering",
    leadDept: "Electrical Systems & Energy"
  },
  {
    name: "Easwari Engineering College",
    district: "Chennai",
    skills: ["AI","Electronics","Software","Energy","Smart City"],
    type: "Engineering",
    leadDept: "AI & Smart Grid Technology"
  },
  {
    name: "E.G.S. Pillay Engineering College",
    district: "Nagapattinam",
    skills: ["Electronics","Electricity","Manufacturing","Energy"],
    type: "Engineering",
    leadDept: "Solar Power & Embedded Electronics"
  },
  {
    name: "Erode Sengunthar Engineering College",
    district: "Erode",
    skills: ["Manufacturing","Textile","Energy","Automation"],
    type: "Engineering",
    leadDept: "Textile Automation & Renewable Energy"
  },
  {
    name: "Excel Engineering College",
    district: "Namakkal",
    skills: ["AI","Electronics","Manufacturing","Energy"],
    type: "Engineering",
    leadDept: "Renewable Energy & IoT"
  },
  {
    name: "Francis Xavier Engineering College",
    district: "Tirunelveli",
    skills: ["Electronics","Electricity","Energy","Infrastructure"],
    type: "Engineering",
    leadDept: "Energy & Civic Infrastructure"
  },
  {
    name: "G.K.M. College of Engineering and Technology",
    district: "Chengalpattu",
    skills: ["AI","Electronics","Manufacturing","Energy"],
    type: "Engineering",
    leadDept: "Energy & Electronics Lab"
  },
  {
    name: "Ganadipathy Tulsi's Engineering College",
    district: "Vellore",
    skills: ["Electronics","Electricity","Manufacturing","Infrastructure"],
    type: "Engineering",
    leadDept: "Electrical & Infrastructure Eng"
  },
  {
    name: "Gnanamani College of Technology",
    district: "Namakkal",
    skills: ["Manufacturing","Electronics","Energy","Automation"],
    type: "Engineering",
    leadDept: "Mechatronics & Automation"
  },
  {
    name: "Government College of Engineering, Bodinayakkanur",
    district: "Theni",
    skills: ["Agriculture","Water Management","Energy","Infrastructure"],
    type: "Engineering",
    leadDept: "Water Management & Agri-Energy"
  },
  {
    name: "Government College of Engineering, Srirangam",
    district: "Tiruchirappalli",
    skills: ["Manufacturing","Electronics","Energy","Infrastructure"],
    type: "Engineering",
    leadDept: "Electrical Power & Infrastructure"
  },
  {
    name: "Government College of Engineering, Tirunelveli",
    district: "Tirunelveli",
    skills: ["Electricity","Electronics","Energy","Infrastructure"],
    type: "Engineering",
    leadDept: "Power Systems & Renewable Energy"
  },
  {
    name: "Government College of Engineering, Thanjavur",
    district: "Thanjavur",
    skills: ["Agriculture","Water Management","Irrigation","Energy"],
    type: "Engineering",
    leadDept: "Irrigation Telemetry & Clean Energy"
  },
  {
    name: "Government College of Engineering, Dharmapuri",
    district: "Dharmapuri",
    skills: ["Agriculture","Rural Development","Water Management","Infrastructure"],
    type: "Engineering",
    leadDept: "Rural Infrastructure & Water Harvesting"
  },
  {
    name: "Government Arts College, Ooty",
    district: "Nilgiris",
    skills: ["Environment","Tourism","Education","Rural Development"],
    type: "Arts & Science",
    leadDept: "High-Altitude Ecology & Tourism"
  },
  {
    name: "Government Arts College, Coimbatore",
    district: "Coimbatore",
    skills: ["Education","Environment","Digital Services","Rural Development"],
    type: "Arts & Science",
    leadDept: "Environmental Botany & Zoology"
  },
  {
    name: "Government Arts College, Salem",
    district: "Salem",
    skills: ["Education","Agriculture","Environment","Digital Literacy"],
    type: "Arts & Science",
    leadDept: "Geology & Environmental Science"
  },
  {
    name: "Government Arts College, Kumbakonam",
    district: "Thanjavur",
    skills: ["Education","Heritage","Tourism","Rural Development"],
    type: "Arts & Science",
    leadDept: "Heritage & Community Sciences"
  },
  {
    name: "Government Arts College, Karur",
    district: "Karur",
    skills: ["Education","Agriculture","Rural Development","Water Management"],
    type: "Arts & Science",
    leadDept: "Cauvery River Ecology & Agriculture"
  },
  {
    name: "Government Arts College, Cuddalore",
    district: "Cuddalore",
    skills: ["Education","Coastal Development","Environment","Fisheries"],
    type: "Arts & Science",
    leadDept: "Coastal Resource Management"
  },
  {
    name: "Government Arts College, Ramanathapuram",
    district: "Ramanathapuram",
    skills: ["Coastal Development","Fisheries","Water Management","Environment"],
    type: "Arts & Science",
    leadDept: "Desalination & Marine Fisheries"
  },
  {
    name: "Government College of Education, Chennai",
    district: "Chennai",
    skills: ["Education","Digital Learning","Teacher Training","Public Education"],
    type: "Education",
    leadDept: "Digital Learning Pedagogies"
  },
  {
    name: "Hindustan Institute of Technology and Science",
    district: "Chengalpattu",
    skills: ["AI","Aerospace","Electronics","Energy","Transportation"],
    type: "University",
    leadDept: "Aeronautics, AI & Green Mobility"
  },
  {
    name: "Indian Institute of Information Technology Design and Manufacturing, Kancheepuram",
    district: "Chengalpattu",
    skills: ["AI","Software","Electronics","Robotics","Smart Infrastructure"],
    type: "University",
    leadDept: "Robotics & Smart Systems Design"
  },
  {
    name: "Indian Institute of Technology Madras",
    district: "Chennai",
    skills: ["AI","Energy","Water Management","Healthcare Technology","Transportation","Climate"],
    type: "University",
    leadDept: "National Center for Combustion, Water & AI"
  },
  {
    name: "Indian Institute of Food Processing Technology",
    district: "Thanjavur",
    skills: ["Food Technology","Agriculture","Food Waste","Rural Development","Supply Chain"],
    type: "University",
    leadDept: "Food Waste Reduction & Cold-Chain Lab"
  },
  {
    name: "Indian Maritime University, Chennai",
    district: "Chennai",
    skills: ["Maritime","Transportation","Coastal Development","Fisheries","Environment"],
    type: "University",
    leadDept: "Harbour Engineering & Ocean Studies"
  },
  {
    name: "Jansons Institute of Technology",
    district: "Coimbatore",
    skills: ["AI","Software","IoT","Electronics","Smart City"],
    type: "Engineering",
    leadDept: "IoT Sensors & Smart Cities"
  },
  {
    name: "Kalasalingam Academy of Research and Education",
    district: "Virudhunagar",
    skills: ["AI","Engineering","Agriculture Technology","Energy","Water Management"],
    type: "University",
    leadDept: "Agri-Robotics & Water Solutions"
  },
  {
    name: "Karunya Institute of Technology and Sciences",
    district: "Coimbatore",
    skills: ["AI","Water Management","Renewable Energy","Healthcare Technology","Agriculture"],
    type: "University",
    leadDept: "Water Institute & Precision Farming"
  },
  {
    name: "Kongu Engineering College",
    district: "Erode",
    skills: ["Manufacturing","Agriculture Technology","Energy","Water Management"],
    type: "Engineering",
    leadDept: "Agri-Drones & Water Filtration"
  },
  {
    name: "Loyola College",
    district: "Chennai",
    skills: ["Education","Social Development","Environment","Digital Services","Public Services"],
    type: "Arts & Science",
    leadDept: "Entomology & Social Ecology Research"
  },
  {
    name: "Madurai Kamaraj University",
    district: "Madurai",
    skills: ["Education","Research","Environment","Social Development","Digital Services"],
    type: "University",
    leadDept: "Biotechnology & Environmental Sciences"
  },
  {
    name: "Madurai Medical College",
    district: "Madurai",
    skills: ["Healthcare","Public Health","Medical Technology","Rural Healthcare"],
    type: "Medical",
    leadDept: "Community Medicine & Epidemic Control"
  },
  {
    name: "Noorul Islam Centre for Higher Education",
    district: "Kanyakumari",
    skills: ["AI","Electronics","Aerospace","Energy","Infrastructure"],
    type: "University",
    leadDept: "Nanotechnology & Renewable Energy"
  },
  {
    name: "Periyar Maniammai Institute of Science and Technology",
    district: "Thanjavur",
    skills: ["Renewable Energy","Agriculture","Water Management","Architecture","Smart Infrastructure"],
    type: "University",
    leadDept: "Bio-Energy & Water Harvesting"
  },
  {
    name: "Presidency College, Chennai",
    district: "Chennai",
    skills: ["Education","Research","Environment","Digital Services"],
    type: "Arts & Science",
    leadDept: "Plant Biology & Marine Ecology"
  },
  {
    name: "S.R.M. Institute of Science and Technology",
    district: "Chengalpattu",
    skills: ["AI","Healthcare","Biotechnology","Energy","Smart City"],
    type: "University",
    leadDept: "Nanotechnology & AI Research Center"
  },
  {
    name: "Sathyabama Institute of Science and Technology",
    district: "Chennai",
    skills: ["AI","Healthcare Technology","Energy","Marine Technology","Infrastructure"],
    type: "University",
    leadDept: "Marine Technology & Waste-to-Energy"
  },
  {
    name: "Saveetha Institute of Medical and Technical Sciences",
    district: "Chennai",
    skills: ["Healthcare","Medical Technology","AI","Biotechnology"],
    type: "Medical",
    leadDept: "Medical Robotics & Healthcare AI"
  },
  {
    name: "Saveetha Engineering College",
    district: "Kanchipuram",
    skills: ["AI","Electronics","Manufacturing","Energy","Smart Infrastructure"],
    type: "Engineering",
    leadDept: "Autonomous Systems & Smart Grids"
  },
  {
    name: "Shanmuga Arts Science Technology Research Academy",
    district: "Thanjavur",
    skills: ["Education","AI","Engineering","Agriculture Technology"],
    type: "University",
    leadDept: "Center for Advanced Research in Agri & AI"
  },
  {
    name: "Sri Krishna College of Engineering and Technology",
    district: "Coimbatore",
    skills: ["AI","Manufacturing","Electronics","Energy"],
    type: "Engineering",
    leadDept: "Mechatronics & Solar Energy Lab"
  },
  {
    name: "Sri Ramakrishna Engineering College",
    district: "Coimbatore",
    skills: ["AI","Electronics","Manufacturing","Energy","Healthcare Technology"],
    type: "Engineering",
    leadDept: "Biomedical Instrumentation & Solar Lab"
  },
  {
    name: "St. Joseph's College of Engineering",
    district: "Chennai",
    skills: ["Electronics","Electricity","Manufacturing","Energy"],
    type: "Engineering",
    leadDept: "Clean Energy & Automation"
  },
  {
    name: "Thiagarajar College of Engineering",
    district: "Madurai",
    skills: ["Electricity","Electronics","Energy","Transportation","Smart City"],
    type: "Engineering",
    leadDept: "Smart Grids & Urban Transportation"
  },
  {
    name: "Vellore Institute of Technology",
    district: "Vellore",
    skills: ["AI","Healthcare Technology","Electronics","Energy","Smart Infrastructure"],
    type: "University",
    leadDept: "AI, Clean Energy & Smart Water Grid"
  },
  {
    name: "Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology",
    district: "Tiruvallur",
    skills: ["AI","Robotics","Electronics","Transportation","Energy"],
    type: "University",
    leadDept: "Electric Mobility & Autonomous Robotics"
  },
  {
    name: "Women’s Christian College",
    district: "Chennai",
    skills: ["Education","Women's Development","Healthcare Awareness","Social Development"],
    type: "Arts & Science",
    leadDept: "Public Nutrition & Community Health"
  },
];

export function matchCollegesForProblem(category: string, title = "", descriptionOrLimit?: string | number, maxLimit = 5): TamilNaduCollege[] {
  const desc = typeof descriptionOrLimit === "string" ? descriptionOrLimit : "";
  const limit = typeof descriptionOrLimit === "number" ? descriptionOrLimit : maxLimit;
  const combined = (category + " " + title + " " + desc).toLowerCase();
  const scored = TAMIL_NADU_COLLEGES.map((c) => {
    let score = 0;
    c.skills.forEach((skill) => {
      if (combined.includes(skill.toLowerCase())) score += 3;
    });
    return { college: c, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score > 0).map((s) => s.college).slice(0, limit);
}

export const getCollegesForProblem = matchCollegesForProblem;
