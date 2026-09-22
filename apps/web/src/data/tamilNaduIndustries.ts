export interface TamilNaduIndustry {
  name: string;
  district: string;
  sector: string;
  grantRange: string;
  facilities: string;
  mentorLead: string;
  cin?: string;
  specialization: string[];
}

export const TAMIL_NADU_INDUSTRIES: TamilNaduIndustry[] = [
  // Chennai & Chengalpattu / Kanchipuram / Tiruvallur Industrial Corridors
  {
    name: "Tata Consultancy Services CSR (Siruseri)",
    district: "Chengalpattu",
    sector: "IT & Smart Public Infrastructure",
    grantRange: "₹25L – ₹75L",
    facilities: "Cloud Compute, IoT Analytics & AI Civic Lab",
    mentorLead: "V. Rajendran (Head - Sustainable Technology)",
    cin: "L22210MH1995PLC084781",
    specialization: ["AI", "Software", "Smart City", "Digital Public Services"]
  },
  {
    name: "Larsen & Toubro Construction & Water Infra (Manapakkam)",
    district: "Chennai",
    sector: "Civil & Water Infrastructure",
    grantRange: "₹25L – ₹60L",
    facilities: "Flow Dynamics & Pipeline Telemetry Rig",
    mentorLead: "Er. S. Ranganathan (Chief Infrastructure Officer)",
    cin: "L99999MH1946PLC004768",
    specialization: ["Water Management", "Infrastructure", "Manufacturing"]
  },
  {
    name: "Ashok Leyland Electric Mobility R&D (Ennore)",
    district: "Chennai",
    sector: "Clean Transportation & Heavy EV",
    grantRange: "₹20L – ₹50L",
    facilities: "EV Powertrain & Battery Telemetry Test Track",
    mentorLead: "Dr. N. Saravanan (VP - Mobility R&D)",
    cin: "L34101TN1948PLC000105",
    specialization: ["Transportation", "Energy", "Manufacturing", "Automation"]
  },
  {
    name: "TVS Motor Company Sustainability (Hosur & Chennai)",
    district: "Krishnagiri",
    sector: "Mobility & Rural Empowerment",
    grantRange: "₹20L – ₹45L",
    facilities: "Lightweight Fabrication & Smart Electronics Lab",
    mentorLead: "R. Dinesh (Director - TVS Community Foundation)",
    cin: "L35921TN1992PLC022845",
    specialization: ["Manufacturing", "Energy", "Automation", "IoT"]
  },
  {
    name: "Hyundai Motor India CSR Foundation (Sriperumbudur)",
    district: "Kanchipuram",
    sector: "Automotive & Community Technology",
    grantRange: "₹25L – ₹60L",
    facilities: "Robotic Welding & High Precision Tooling Lab",
    mentorLead: "G. Gopalan (Head of CSR)",
    cin: "U29309TN1996PLC035377",
    specialization: ["Manufacturing", "Automation", "IoT", "Infrastructure"]
  },
  {
    name: "VA Tech Wabag Ltd (Sunnambu Kolathur)",
    district: "Chennai",
    sector: "Municipal Water Treatment & Desalination",
    grantRange: "₹20L – ₹45L",
    facilities: "Membrane Bioreactor & Heavy Desalination Plant",
    mentorLead: "S. Kalyanaraman (Technology Director)",
    cin: "L45205TN1995PLC030231",
    specialization: ["Water Management", "Sanitation", "Environment"]
  },
  {
    name: "Lucas TVS Innovation Labs (Padi)",
    district: "Chennai",
    sector: "Auto Electrical & Smart Power Grids",
    grantRange: "₹15L – ₹35L",
    facilities: "Brushless Motor & Power Inverter Prototyping",
    mentorLead: "K. Balaji (General Manager - Innovation)",
    cin: "U35999TN1961PLC004678",
    specialization: ["Electricity", "Energy", "Electronics", "Manufacturing"]
  },
  {
    name: "Murugappa Group / EID Parry Bio-Energy",
    district: "Chennai",
    sector: "AgriTech & Bio-Renewables",
    grantRange: "₹20L – ₹40L",
    facilities: "Bio-Ethanol & Soil Bio-Enzyme Analysis Lab",
    mentorLead: "M. M. Murugappan (Trustee - CSR)",
    cin: "L24211TN1975PLC006989",
    specialization: ["Agriculture", "Energy", "Environment", "Rural Development"]
  },
  {
    name: "Saint-Gobain India Research Center (IIT Madras Research Park)",
    district: "Chennai",
    sector: "Advanced Materials & Sustainable Habitat",
    grantRange: "₹20L – ₹50L",
    facilities: "Solar Glass Coating & Thermal Efficiency Chambers",
    mentorLead: "B. Santhanam (CEO - Materials Group)",
    cin: "U26102TN1997PTC037996",
    specialization: ["Energy", "Smart City", "Manufacturing", "Environment"]
  },

  // Coimbatore & Tiruppur & Erode Engineering / Textile / Automation Hubs
  {
    name: "LMW (Lakshmi Machine Works) Advanced Automation",
    district: "Coimbatore",
    sector: "Textile Automation & Precision Machinery",
    grantRange: "₹25L – ₹50L",
    facilities: "5-Axis CNC Precision & Mechatronics Testing Lab",
    mentorLead: "Sanjay Jayavarthanavelu (CMD & Innovation Chair)",
    cin: "L29269TZ1962PLC000463",
    specialization: ["Manufacturing", "Automation", "Energy", "Textile"]
  },
  {
    name: "Pricol Limited Smart Telematics",
    district: "Coimbatore",
    sector: "Automotive Sensors & IoT Telemetry",
    grantRange: "₹15L – ₹35L",
    facilities: "Digital Fleet Sensor & Micro-Electronic SMD Line",
    mentorLead: "Vanitha Mohan (Vice Chairman - CSR)",
    cin: "L34200TZ2011PLC022194",
    specialization: ["IoT", "Electronics", "Transportation", "AI"]
  },
  {
    name: "Roots Industries Automotive Innovations",
    district: "Coimbatore",
    sector: "Acoustic Engineering & Cleaning Tech",
    grantRange: "₹12L – ₹30L",
    facilities: "Industrial Cleaning Hardware & Sonic Sensors",
    mentorLead: "K. Ramasamy (Chairman - Roots Innovation)",
    cin: "U29199TZ1990PLC002778",
    specialization: ["Sanitation", "Manufacturing", "Electronics", "Smart City"]
  },
  {
    name: "Aquasub Engineering (Texmo Pipes & Pumps)",
    district: "Coimbatore",
    sector: "Agricultural & Submersible Water Pumps",
    grantRange: "₹18L – ₹40L",
    facilities: "High Pressure Pump Hydraulics & Flow Chamber",
    mentorLead: "C. R. Anandakrishnan (Director - R&D)",
    cin: "U29120TZ1982PTC001150",
    specialization: ["Water Management", "Agriculture", "Electricity", "Manufacturing"]
  },
  {
    name: "Sakthi Sugars & Bio-Power Grid",
    district: "Erode",
    sector: "Co-Generation Power & Agri Bio-Tech",
    grantRange: "₹15L – ₹35L",
    facilities: "Biomass Gasifier & Organic Compost Telemetry",
    mentorLead: "Dr. M. Manickam (Executive Chairman)",
    cin: "L15421TZ1961PLC000396",
    specialization: ["Energy", "Agriculture", "Rural Development", "Water Management"]
  },
  {
    name: "Eastman Exports Global Sustainability (Tiruppur)",
    district: "Tiruppur",
    sector: "Zero Liquid Discharge & Sustainable Textiles",
    grantRange: "₹20L – ₹45L",
    facilities: "Solar Thermal & Effluent Zero Liquid Discharge Plant",
    mentorLead: "N. Chandran (Chairman - CSR)",
    cin: "U18101TZ2006PTC012658",
    specialization: ["Water Management", "Waste Management", "Environment", "Textile"]
  },
  {
    name: "Bannari Amman Sugars Cogeneration (Sathyamangalam)",
    district: "Erode",
    sector: "Renewable Bio-Energy & Agri Irrigation",
    grantRange: "₹15L – ₹35L",
    facilities: "Turbine Grid Sync & Soil Telemetry Units",
    mentorLead: "S. V. Balasubramaniam (Chairman)",
    cin: "L15421TZ1983PLC001358",
    specialization: ["Energy", "Agriculture", "Electricity", "Water Management"]
  },
  {
    name: "KPR Mill Green Energy & Textile Foundation",
    district: "Tiruppur",
    sector: "Wind Energy & Sustainable Apparel",
    grantRange: "₹20L – ₹50L",
    facilities: "Windmill Power Telemetry & Automated Knitting",
    mentorLead: "K. P. Ramasamy (Chairman - KPR Group)",
    cin: "L17111TZ2003PLC010518",
    specialization: ["Energy", "Manufacturing", "Automation", "Environment"]
  },

  // Madurai & Theni & Dindigul Industrial Area
  {
    name: "TVS Srichakra Tyres & Rubber Innovation",
    district: "Madurai",
    sector: "Polymer Engineering & Road Safety",
    grantRange: "₹15L – ₹38L",
    facilities: "High Friction Rubber & Wear Rate Sensors",
    mentorLead: "Shobhana Ramachandhran (Managing Director)",
    cin: "L25111TN1982PLC009414",
    specialization: ["Transportation", "Manufacturing", "Infrastructure"]
  },
  {
    name: "Hi-Tech Arai Advanced Sealing Systems",
    district: "Madurai",
    sector: "Hydraulic Seals & Automotive Mechatronics",
    grantRange: "₹12L – ₹30L",
    facilities: "Precision Oil Seal & Pressure Telemetry Chamber",
    mentorLead: "B. T. Bangera (Managing Director)",
    cin: "U25199TN1985PTC012351",
    specialization: ["Manufacturing", "Water Management", "Automation"]
  },
  {
    name: "Nagarathinam Mills & AgriTech CSR",
    district: "Dindigul",
    sector: "Rural Agriculture & Food Processing",
    grantRange: "₹10L – ₹25L",
    facilities: "Grain Moisture Telemetry & Cold Storage Unit",
    mentorLead: "N. Sundararajan (Director)",
    cin: "U17111TN1995PTC031201",
    specialization: ["Agriculture", "Rural Development", "Energy"]
  },

  // Tiruchirappalli & Thanjavur & Karur Industrial Hubs
  {
    name: "BHEL Small Industries Association CSR (BHELSIA)",
    district: "Tiruchirappalli",
    sector: "Heavy Boilers, Thermal & Renewable Power",
    grantRange: "₹20L – ₹45L",
    facilities: "High Pressure Vessel Testing & Welding Robotics",
    mentorLead: "Er. Rajappa (President - Industrial Cluster)",
    cin: "U28112TN1988NPL015482",
    specialization: ["Energy", "Manufacturing", "Electricity", "Infrastructure"]
  },
  {
    name: "Chettinad Cements Sustainable Mining (Karur & Ariyalur)",
    district: "Ariyalur",
    sector: "Green Cement & Industrial Waste Utilization",
    grantRange: "₹20L – ₹50L",
    facilities: "Fly Ash Blending & Limestone Kiln Automation",
    mentorLead: "M. A. M. R. Muthiah (Managing Director)",
    cin: "L26942TN1962PLC004947",
    specialization: ["Infrastructure", "Waste Management", "Environment"]
  },
  {
    name: "Seshasayee Paper and Boards Ltd (Pallipalayam/Karur)",
    district: "Erode",
    sector: "Paper Tech & Effluent Treatment",
    grantRange: "₹15L – ₹35L",
    facilities: "Bio-Methanation & Water Recycling Filter Beds",
    mentorLead: "N. Gopalaratnam (Chairman)",
    cin: "L21012TZ1960PLC000364",
    specialization: ["Water Management", "Environment", "Manufacturing"]
  },
  {
    name: "Thanjavur Agro Processing & Rice Milling Cluster",
    district: "Thanjavur",
    sector: "Rice Bran Oil & Paddy Husk Bio-Energy",
    grantRange: "₹12L – ₹28L",
    facilities: "Husk Gasification & Solar Grain Dryers",
    mentorLead: "V. Govindasamy (Cluster President)",
    cin: "U15312TN2001PTC047120",
    specialization: ["Agriculture", "Energy", "Rural Development", "Food Technology"]
  },

  // Salem & Namakkal & Dharmapuri Heavy Industry / Poultry / Steel
  {
    name: "JSW Steel Ltd (Salem Works - Mecheri)",
    district: "Salem",
    sector: "Special Alloy Steels & Metallurgical Waste",
    grantRange: "₹25L – ₹60L",
    facilities: "Slag Recycling & High Temperature Furnaces",
    mentorLead: "Pawan Kedia (Associate VP - CSR)",
    cin: "L27102MH1994PLC152925",
    specialization: ["Manufacturing", "Infrastructure", "Waste Management", "Energy"]
  },
  {
    name: "Salem Steel Plant (SAIL)",
    district: "Salem",
    sector: "Stainless Steel & Deep Drawing Tech",
    grantRange: "₹20L – ₹50L",
    facilities: "Cold Rolling Mill & Surface Treatment Lab",
    mentorLead: "Executive Director (CSR & Environment)",
    cin: "L27109DL1973GOI006454",
    specialization: ["Manufacturing", "Infrastructure", "Electricity"]
  },
  {
    name: "Namakkal Poultry & Agro Automation Cluster",
    district: "Namakkal",
    sector: "Poultry Bio-Waste to Electricity",
    grantRange: "₹15L – ₹30L",
    facilities: "Anaerobic Digester & Biogas Power Generator",
    mentorLead: "Dr. P. Selvaraj (President - Poultry Cluster)",
    cin: "U01222TN1999PTC042881",
    specialization: ["Agriculture", "Energy", "Waste Management", "Rural Development"]
  },

  // Thoothukudi & Tirunelveli & Kanyakumari Marine / Port / Solar / Wind
  {
    name: "VO Chidambaranar Port Authority Maritime CSR",
    district: "Thoothukudi",
    sector: "Marine Logistics & Coastal Environmental Protection",
    grantRange: "₹25L – ₹65L",
    facilities: "Harbour Dredging & Ocean Wave Energy Telemetry",
    mentorLead: "Chief Engineer (Civil & Marine Infra)",
    cin: "GOI-PORT-TRUST-TN01",
    specialization: ["Coastal Development", "Maritime", "Transportation", "Environment"]
  },
  {
    name: "Sterlite Copper Sustainable Community Works (Thoothukudi)",
    district: "Thoothukudi",
    sector: "Desalination & Community Health Tech",
    grantRange: "₹20L – ₹50L",
    facilities: "Desalination RO Plant & Rural Drinking Water Kiosks",
    mentorLead: "Dr. Sumathi (Head of CSR & Health)",
    cin: "L27201MH1965PLC013320",
    specialization: ["Water Management", "Healthcare", "Environment"]
  },
  {
    name: "Suzlon Wind Energy Muppandal Farm",
    district: "Kanyakumari",
    sector: "High Wind Velocity Turbine Telematics",
    grantRange: "₹20L – ₹45L",
    facilities: "Wind Turbine SCADA & Inverter Testing",
    mentorLead: "K. S. Narayanan (VP - Wind Energy Operations)",
    cin: "L40100GJ1995PLC025447",
    specialization: ["Energy", "Electricity", "IoT", "Infrastructure"]
  },
  {
    name: "Sun Paper Mills & Forest Biomass",
    district: "Tirunelveli",
    sector: "Agro-Forestry & Water Recycling",
    grantRange: "₹12L – ₹28L",
    facilities: "Bio-Pulping & Effluent Biological Treatment",
    mentorLead: "T. S. R. Murthy (Technical Director)",
    cin: "L21012TN1961PLC004509",
    specialization: ["Environment", "Water Management", "Agriculture"]
  },

  // Vellore & Ranipet & Tirupathur Leather / Footwear / Chemicals
  {
    name: "Ranipet Leather Finished Products Cluster (RANITEC)",
    district: "Ranipet",
    sector: "Zero Liquid Discharge Effluent Treatment",
    grantRange: "₹20L – ₹45L",
    facilities: "Multi-Effect Evaporation & Reverse Osmosis Plant",
    mentorLead: "C. M. Zafarullah (Managing Director)",
    cin: "U19111TN1993NPL025810",
    specialization: ["Water Management", "Waste Management", "Environment"]
  },
  {
    name: "BAPEX Heavy Electrical Infrastructure (Ranipet)",
    district: "Ranipet",
    sector: "Electrostatic Precipitators & Air Pollution Control",
    grantRange: "₹18L – ₹40L",
    facilities: "Industrial Baghouse & Fly Ash Scrubbers Lab",
    mentorLead: "S. Swaminathan (GM - Environmental Engineering)",
    cin: "U31900TN1985PTC011988",
    specialization: ["Environment", "Manufacturing", "Energy"]
  },

  // Virudhunagar & Sivakasi Printing / Fireworks Safety / Match Automation
  {
    name: "Sivakasi Master Printers Automated Packaging Cluster",
    district: "Virudhunagar",
    sector: "Sustainable Inks & Automated Folding Carton",
    grantRange: "₹15L – ₹35L",
    facilities: "Soy-Based Ink Testing & Automated High Speed Offset",
    mentorLead: "A. Sankaralingam (President - Printers Association)",
    cin: "U22121TN1998PTC040992",
    specialization: ["Manufacturing", "Waste Management", "Automation"]
  },
  {
    name: "Standard Fireworks Green Pyrotechnics Research",
    district: "Virudhunagar",
    sector: "Clean Chemistry & Reduced Smoke Formulation",
    grantRange: "₹15L – ₹35L",
    facilities: "Zero Barium Chemistry & Sound Decibel Telemetry",
    mentorLead: "Y. Chelladurai (Director - Safety Research)",
    cin: "U24292TN1980PLC008102",
    specialization: ["Environment", "Manufacturing", "Chemistry"]
  },

  // Krishnagiri & Hosur EV & Electronics Corridor
  {
    name: "Ola Electric Futurefactory CSR (Pochampalli)",
    district: "Krishnagiri",
    sector: "Gigafactory EV Cells & Battery Recycling",
    grantRange: "₹30L – ₹80L",
    facilities: "Lithium Ion Cell Testing & Automated BMS Diagnostics",
    mentorLead: "B. Anand (Director - EV Ecosystem)",
    cin: "U74999KA2017PTC099091",
    specialization: ["Transportation", "Energy", "IoT", "Automation"]
  },
  {
    name: "Tata Electronics Precision Machining (Hosur)",
    district: "Krishnagiri",
    sector: "Semiconductor Enclosures & Smart Hardware",
    grantRange: "₹25L – ₹70L",
    facilities: "Clean Room Assembly & High Precision CNC Line",
    mentorLead: "Dr. Randhir Thakur (CEO & MD)",
    cin: "U74999TN2020PLC134789",
    specialization: ["Manufacturing", "Electronics", "IoT", "AI"]
  },
  {
    name: "Delta Electronics India Smart Power (Hosur)",
    district: "Krishnagiri",
    sector: "Industrial Automation & Solar Inverters",
    grantRange: "₹20L – ₹50L",
    facilities: "Solar Inverter Efficiency Chamber & SCADA Lab",
    mentorLead: "Benjamin Lin (President - Delta India)",
    cin: "U31900HR2003PTC048590",
    specialization: ["Electricity", "Energy", "Automation", "Electronics"]
  }
];
