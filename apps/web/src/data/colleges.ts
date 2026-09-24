export interface CollegeInfo {
  id: string;
  name: string;
  district: string;
}

export const STATE_COLLEGES: Record<string, CollegeInfo[]> = {
  "Jharkhand": [
    { id: "jh1", name: "Indian Institute of Technology (IIT ISM)", district: "Dhanbad" },
    { id: "jh2", name: "National Institute of Technology (NIT)", district: "Jamshedpur" },
    { id: "jh3", name: "Birla Institute of Technology (BIT)", district: "Mesra, Ranchi" },
    { id: "jh4", name: "Xavier Institute of Social Service (XISS)", district: "Ranchi" },
    { id: "jh5", name: "Ranchi University", district: "Ranchi" },
    { id: "jh6", name: "St. Xavier's College", district: "Ranchi" },
    { id: "jh7", name: "Vinoba Bhave University", district: "Hazaribagh" },
    { id: "jh8", name: "Sido Kanhu Murmu University", district: "Dumka" },
    { id: "jh9", name: "Kolhan University", district: "Chaibasa" },
    { id: "jh10", name: "Nilamber-Pitamber University", district: "Palamu" },
    { id: "jh11", name: "Dr. Shyama Prasad Mukherjee University", district: "Ranchi" },
    { id: "jh12", name: "Jamshedpur Women's College", district: "Jamshedpur" },
    { id: "jh13", name: "RVS College of Engineering and Technology", district: "Jamshedpur" },
    { id: "jh14", name: "Cambridge Institute of Technology", district: "Ranchi" },
    { id: "jh15", name: "Bokaro Steel City College", district: "Bokaro" }
  ],
  "Maharashtra": [
    { id: "mh1", name: "Indian Institute of Technology (IIT)", district: "Mumbai" },
    { id: "mh2", name: "Pune University (Savitribai Phule Pune University)", district: "Pune" },
    { id: "mh3", name: "VJTI Mumbai", district: "Mumbai" },
    { id: "mh4", name: "College of Engineering Pune (COEP)", district: "Pune" }
  ],
  "Delhi": [
    { id: "dl1", name: "Indian Institute of Technology (IIT)", district: "New Delhi" },
    { id: "dl2", name: "Delhi University", district: "New Delhi" },
    { id: "dl3", name: "Jawaharlal Nehru University (JNU)", district: "New Delhi" }
  ],
  "Karnataka": [
    { id: "ka1", name: "Indian Institute of Science (IISc)", district: "Bengaluru" },
    { id: "ka2", name: "National Institute of Technology Karnataka (NITK)", district: "Surathkal" },
    { id: "ka3", name: "Manipal Academy of Higher Education", district: "Udupi" },
    { id: "ka4", name: "Visvesvaraya Technological University", district: "Belagavi" }
  ],
  "Kerala": [
    { id: "kl1", name: "National Institute of Technology (NIT)", district: "Calicut" },
    { id: "kl2", name: "University of Kerala", district: "Thiruvananthapuram" },
    { id: "kl3", name: "Cochin University of Science and Technology", district: "Ernakulam" }
  ]
};

export const getCollegesForState = (state: string): CollegeInfo[] => {
  return STATE_COLLEGES[state] || [];
};
