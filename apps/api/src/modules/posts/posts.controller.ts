import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../../middleware/auth.middleware';
import { matchCollegesForProblem } from '../../data/tamilNaduColleges';
import { io } from '../../index';
import fs from 'fs';

const prisma = new PrismaClient();

// Task 6: Common, standardized Industry Candidate Structure
export interface StandardIndustryCandidate {
  name: string;
  sector: string;
  cin: string;
  grantRange: string;
  facilities: string;
  mentorLead: string;
  score: number;
}

// Helper to generate 10 domain-specific matched industries with standardized common metadata
export function get10IndustryCandidates(category: string, title: string): StandardIndustryCandidate[] {
  const cat = (category || '').toLowerCase();
  const t = (title || '').toLowerCase();

  if (cat.includes('water') || t.includes('water') || t.includes('pipe') || t.includes('drain')) {
    return [
      { name: 'Tata Sustainability (Water Div)', sector: 'Water & Utilities', cin: 'L28920MH1919PLC000567', grantRange: '₹15L – ₹30L', facilities: 'Flow Hydraulics & IoT Sensors Lab', mentorLead: 'Dr. Vikram Malhotra (VP - Water Infra)', score: 98 },
      { name: 'Larsen & Toubro Water Infra', sector: 'Engineering & Construction', cin: 'L99999MH1946PLC004768', grantRange: '₹20L – ₹40L', facilities: 'Civil Pipe Fabrication & Leak Telemetry', mentorLead: 'Er. Rajesh Singhal (Chief Project Director)', score: 96 },
      { name: 'Thermax Water Solutions', sector: 'Environmental Tech', cin: 'L29299PN1980PLC022787', grantRange: '₹12L – ₹25L', facilities: 'Membrane Filtration & Waste Recycling', mentorLead: 'Ananya Deshmukh (Head of Sustainability)', score: 94 },
      { name: 'VA Tech Wabag Ltd', sector: 'Water Treatment', cin: 'L45205TN1995PLC030231', grantRange: '₹15L – ₹28L', facilities: 'Municipal Desalination & Sewage Purification', mentorLead: 'S. Kalyanaraman (Tech Director)', score: 92 },
      { name: 'Grundfos Pumps India', sector: 'Smart Pumping & IoT', cin: 'U29120TN1998PTC040212', grantRange: '₹10L – ₹20L', facilities: 'Automated Solar Water Pumps & Valve Testing', mentorLead: 'N. Venkataraman (R&D Lead)', score: 90 },
      { name: 'Ion Exchange India Ltd', sector: 'Water Purification', cin: 'L74999MH1965PLC013384', grantRange: '₹10L – ₹22L', facilities: 'Resin Ionization & Heavy Metal Filter Units', mentorLead: 'Prakash Hegde (Senior VP - CSR)', score: 88 },
      { name: 'Forbes Marshall Energy & Water', sector: 'Industrial Automation', cin: 'U28991PN1985PTC036582', grantRange: '₹8L – ₹18L', facilities: 'Smart Metering & Telemetric Flow Monitoring', mentorLead: 'K. R. Raman (Industrial Engineering)', score: 87 },
      { name: 'Kirloskar Brothers Water Infra', sector: 'Flow Management', cin: 'L29113PN1920PLC000670', grantRange: '₹10L – ₹25L', facilities: 'Heavy Bore Valve & Pipeline Engineering', mentorLead: 'Alok Joshi (Infrastructure CSR Lead)', score: 85 },
      { name: 'Jain Irrigation Systems', sector: 'Agri & Water Management', cin: 'L29120MH1986PLC042028', grantRange: '₹12L – ₹20L', facilities: 'Micro-Drip Pipeline & Soil Moisture Probes', mentorLead: 'Mahesh Patil (VP - Agri Water)', score: 83 },
      { name: 'UPL Sustainable Water Initiative', sector: 'Chemical & Environmental', cin: 'L24219GJ1985PLC025132', grantRange: '₹15L – ₹30L', facilities: 'Water Body Rejuvenation & Biotreatment', mentorLead: 'Dr. Sneha Roy (Environmental CSR)', score: 81 },
    ];
  } else if (cat.includes('energy') || cat.includes('solar') || cat.includes('electric') || t.includes('light') || t.includes('power')) {
    return [
      { name: 'Tata Power Solar Systems', sector: 'Clean Energy & Microgrids', cin: 'L28920MH1919PLC000567', grantRange: '₹20L – ₹50L', facilities: 'Solar PV Test Bed & Microgrid Lab', mentorLead: 'Dr. Alok Verma (VP - Renewable Engineering)', score: 98 },
      { name: 'Adani Green Energy Ltd', sector: 'Renewable Utilities', cin: 'L40106GJ2015PLC082007', grantRange: '₹25L – ₹60L', facilities: 'Grid Synchronization & High Capacity Inverters', mentorLead: 'Prashant Sen (Director - Clean Energy)', score: 96 },
      { name: 'ReNew Power Ventures', sector: 'Clean Tech Solutions', cin: 'U40300DL2011PTC291527', grantRange: '₹15L – ₹35L', facilities: 'Decentralized Microgrid & Battery Storage', mentorLead: 'Sunita Narain (Head of Connecting Social Problem)', score: 94 },
      { name: 'Hero Future Energies', sector: 'Decentralized Solar', cin: 'U40108DL2012PLC231718', grantRange: '₹12L – ₹28L', facilities: 'Rooftop Solar & Smart Street Lighting Lab', mentorLead: 'Rahul Munjal (Innovation Lead)', score: 92 },
      { name: 'Schneider Electric India CSR', sector: 'Smart Power Distribution', cin: 'U31900DL1995PTC063991', grantRange: '₹18L – ₹40L', facilities: 'Automated Switchgear & Power Telemetry', mentorLead: 'Marc Dupont (Global Access to Energy)', score: 90 },
      { name: 'Vikram Solar Innovations', sector: 'PV Modules & R&D', cin: 'U18109WB2005PLC106557', grantRange: '₹10L – ₹25L', facilities: 'High Efficiency Monocrystalline PV Lab', mentorLead: 'Gyanesh Chaudhary (MD & CSR Chair)', score: 89 },
      { name: 'Waaree Energies Ltd', sector: 'Solar Engineering', cin: 'U29248MH1990PLC058763', grantRange: '₹12L – ₹30L', facilities: 'Rural Solar Pumps & Illumination Grids', mentorLead: 'Hitesh Doshi (Chairman - CSR)', score: 87 },
      { name: 'ABB India Smart Grids', sector: 'Power Automation', cin: 'L32202KA1949PLC032923', grantRange: '₹20L – ₹45L', facilities: 'SCADA Sensors & Grid Voltage Stabilizers', mentorLead: 'Sanjeev Sharma (CTO & CSR Lead)', score: 85 },
      { name: 'Havells India Smart Lighting', sector: 'Electrical Infrastructure', cin: 'L31900DL1983PLC016304', grantRange: '₹10L – ₹22L', facilities: 'Solar LED Lighting & Smart Pole R&D', mentorLead: 'Anil Rai Gupta (Director - CSR)', score: 83 },
      { name: 'Siemens Energy India', sector: 'Grid Modernization', cin: 'L28920MH1957PLC010839', grantRange: '₹25L – ₹50L', facilities: 'Substation Telemetry & Surge Protection', mentorLead: 'Dr. Armin Schnettler (Head of New Energy)', score: 80 },
    ];
  } else if (cat.includes('agri') || t.includes('farmer') || t.includes('crop') || t.includes('soil')) {
    return [
      { name: 'ITC Agribusiness Division', sector: 'AgriTech & Supply Chain', cin: 'L16005WB1910PLC001985', grantRange: '₹15L – ₹35L', facilities: 'e-Choupal Rural Network & Soil Sensors', mentorLead: 'S. Sivakumar (Group Head - Agri)', score: 98 },
      { name: 'Mahindra Agri Solutions', sector: 'Farm Equipment & Tech', cin: 'U01403MH2000PLC125867', grantRange: '₹18L – ₹40L', facilities: 'Precision Agriculture & Drone Spraying Lab', mentorLead: 'Ashok Sharma (MD & CEO - Agri)', score: 96 },
      { name: 'Bayer CropScience India CSR', sector: 'Sustainable Agriculture', cin: 'L24210MH1958PLC011173', grantRange: '₹20L – ₹45L', facilities: 'Crop Pathology Lab & Satellite Forecasting', mentorLead: 'D. Narain (President - South Asia)', score: 94 },
      { name: 'Godrej Agrovet Ltd', sector: 'Rural Agribusiness', cin: 'L15410MH1991PLC135359', grantRange: '₹12L – ₹25L', facilities: 'Bio-Fertilizer & Cattle Feed Formulation', mentorLead: 'Balram Yadav (Managing Director)', score: 92 },
      { name: 'UPL Agro Sustainability', sector: 'Crop Protection & Bio', cin: 'L24219GJ1985PLC025132', grantRange: '₹15L – ₹30L', facilities: 'Soil Moisture Sensors & Organic Biostimulants', mentorLead: 'Jai Shroff (Global CEO)', score: 90 },
      { name: 'Coromandel International', sector: 'Nutrient & Soil Science', cin: 'L24120TG1961PLC000892', grantRange: '₹10L – ₹24L', facilities: 'Customized Fertilizer Pilot Production', mentorLead: 'Arun Alagappan (Executive Vice Chairman)', score: 88 },
      { name: 'Escorts Kubota Agri R&D', sector: 'Farm Mechanization', cin: 'L65921HR1944PLC000845', grantRange: '₹12L – ₹28L', facilities: 'Electric Mini-Tractors & Harvest Automation', mentorLead: 'Nikhil Nanda (Chairman & MD)', score: 86 },
      { name: 'PI Industries Green Fund', sector: 'Bio-Innovations', cin: 'L24211RJ1946PLC000469', grantRange: '₹10L – ₹22L', facilities: 'Green Chemistry & Microencapsulation', mentorLead: 'Mayank Singhal (Vice Chairman)', score: 84 },
      { name: 'Dhanuka Agritech Ltd', sector: 'Precision Agriculture', cin: 'L24219DL1985PLC025389', grantRange: '₹8L – ₹18L', facilities: 'Farmer Advisory AI & Weather Telemetry', mentorLead: 'R. G. Agarwal (Group Chairman)', score: 82 },
      { name: 'VST Tillers & Robotics', sector: 'Smart Agri Machinery', cin: 'L34101KA1967PLC001706', grantRange: '₹10L – ₹20L', facilities: 'Small-Holder Automation & Weeding Robots', mentorLead: 'V. T. Ravindra (Director)', score: 80 },
    ];
  } else {
    return [
      { name: 'Reliance Foundation CSR', sector: 'Conglomerate CSR & Tech', cin: 'L17110MH1973PLC019786', grantRange: '₹25L – ₹75L', facilities: 'IoT Prototyping & High Capacity Compute', mentorLead: 'J. Jagannathan (Head of CSR Strategy)', score: 97 },
      { name: 'Infosys Foundation Social Hub', sector: 'Software, IoT & Smart City', cin: 'L85110KA1981PLC013115', grantRange: '₹20L – ₹50L', facilities: 'AI Analytics & Citizen Dashboard Cloud', mentorLead: 'Sudha Gopalakrishnan (Trustee)', score: 95 },
      { name: 'Tata Trusts Innovation Lab', sector: 'Civic & Rural Development', cin: 'U85190MH1919PLC000567', grantRange: '₹20L – ₹60L', facilities: 'Community Prototyping & Field Testing Labs', mentorLead: 'S. Venkataramanan (Managing Trustee)', score: 94 },
      { name: 'Larsen & Toubro Smart World', sector: 'Civic Infrastructure', cin: 'L99999MH1946PLC004768', grantRange: '₹25L – ₹55L', facilities: 'Smart Municipal Sensors & Command Center', mentorLead: 'M. V. Satish (Director - Buildings & Infra)', score: 92 },
      { name: 'Wipro Cares Foundation', sector: 'Urban Governance & Tech', cin: 'L32102KA1945PLC020800', grantRange: '₹15L – ₹35L', facilities: 'Civic Data Analytics & Hardware Testing', mentorLead: 'Anurag Behar (Chief Sustainability Officer)', score: 90 },
      { name: 'Mahindra Rise Innovation CSR', sector: 'Social Tech & Mobility', cin: 'L65990MH1945PLC004558', grantRange: '₹15L – ₹40L', facilities: 'Fabrication & Low Cost Mechanical Hardware', mentorLead: 'Sheetal Mehta (Senior VP - CSR)', score: 88 },
      { name: 'HCL Foundation Civic Impact', sector: 'Environmental & Municipal', cin: 'L74140DL1991PLC046369', grantRange: '₹12L – ₹30L', facilities: 'Solid Waste Telemetry & Clean Energy Grids', mentorLead: 'Alok Varma (Project Director)', score: 86 },
      { name: 'Bosch India Social Projects', sector: 'Sensors & Smart Mobility', cin: 'L85110KA1951PLC000761', grantRange: '₹18L – ₹45L', facilities: 'Micro-Sensors & Automated Controller Assembly', mentorLead: 'Soumitra Bhattacharya (MD & CSR Head)', score: 85 },
      { name: 'Honeywell Hometown Solutions', sector: 'Automation & Clean Cities', cin: 'L28920MH1984PLC033390', grantRange: '₹15L – ₹38L', facilities: 'Clean Air, Water Telemetry & Safety Testing', mentorLead: 'Mike Bennett (President - India CSR)', score: 83 },
      { name: 'Godrej & Boyce CSR', sector: 'Urban Sustainability', cin: 'U28993MH1932PLC001828', grantRange: '₹12L – ₹30L', facilities: 'Energy Efficient Systems & Metal Fabrication', mentorLead: 'Jamshyd Godrej (Chairman & MD)', score: 81 },
    ];
  }
}

// Task 4: Helper to generate a problem-specific approval memo
export function generateProblemSpecificApprovalMemo(post: {
  title: string;
  category?: string | null;
  location?: string | null;
  acceptedCollegeName?: string | null;
  acceptedIndustryName?: string | null;
}): string {
  const cat = (post.category || '').toLowerCase();
  const loc = post.location || 'Civic Ward Jurisdiction';

  if (cat.includes('water') || post.title.toLowerCase().includes('water')) {
    return `OFFICIAL APPROVAL MEMORANDUM:
Problem: "${post.title}"
Location: ${loc}
Authorized Technical Scope: Deployment of sensor-based pipeline telemetry, pressure regulation valves, and potable filtration test-rig.
Research Lead: ${post.acceptedCollegeName || 'University Engineering Lab'}
Corporate CSR Sponsor: ${post.acceptedIndustryName || 'Industry Partner'}
Status: Fully Sanctioned for Lab Prototype & On-Site Installation.`;
  } else if (cat.includes('energy') || cat.includes('solar') || post.title.toLowerCase().includes('light')) {
    return `OFFICIAL APPROVAL MEMORANDUM:
Problem: "${post.title}"
Location: ${loc}
Authorized Technical Scope: Installation of decentralized solar PV microgrid, dusk-to-dawn intelligent LED controllers, and battery storage.
Research Lead: ${post.acceptedCollegeName || 'University Engineering Lab'}
Corporate CSR Sponsor: ${post.acceptedIndustryName || 'Industry Partner'}
Status: Fully Sanctioned for Lab Prototype & On-Site Installation.`;
  } else if (cat.includes('agri') || post.title.toLowerCase().includes('crop')) {
    return `OFFICIAL APPROVAL MEMORANDUM:
Problem: "${post.title}"
Location: ${loc}
Authorized Technical Scope: Automated soil moisture telemetry, IoT irrigation regulation, and crop health diagnostic prototype.
Research Lead: ${post.acceptedCollegeName || 'University Engineering Lab'}
Corporate CSR Sponsor: ${post.acceptedIndustryName || 'Industry Partner'}
Status: Fully Sanctioned for Agricultural Field Pilot.`;
  } else {
    return `OFFICIAL APPROVAL MEMORANDUM:
Problem: "${post.title}"
Location: ${loc}
Authorized Technical Scope: Municipal engineering prototype, automated IoT sensing, and community deployment.
Research Lead: ${post.acceptedCollegeName || 'University Engineering Lab'}
Corporate CSR Sponsor: ${post.acceptedIndustryName || 'Industry Partner'}
Status: Fully Sanctioned for Fabrication & Ground Rollout.`;
  }
}

// Automatically ensure 10 industry matches are generated for a challenge
export async function ensureIndustryMatches(postId: string, category: string, title: string) {
  const existing = await prisma.industryMatch.findMany({ where: { postId } });
  if (existing.length === 0) {
    const candidates = get10IndustryCandidates(category, title);
    for (const c of candidates) {
      await prisma.industryMatch.create({
        data: {
          postId,
          industryName: c.name,
          industrySector: c.sector,
          matchScore: c.score,
          status: 'INVITED',
        },
      });
    }

    // Seed initial AI match message in collaboration chat
    await prisma.collaborationMessage.create({
      data: {
        postId,
        senderRole: 'AI',
        senderName: 'Connecting Social Problem AI Engine',
        text: `🤖 AI Matcher analyzed this challenge and dispatched R&D collaboration invitations to 10 top-matched industry partners (Leading candidates: ${candidates.slice(0, 3).map((c) => c.name).join(', ')}). The first industry partner to accept will lock exclusive sponsorship for this project.`,
      },
    });
  }
}

// GET /api/posts — Public feed & search
export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const searchQuery = (req.query.search as string || req.query.q as string || '').trim();
    const filterUserId = (req.query.userId as string || '').trim();
    const filterCategory = (req.query.category as string || '').trim();
    const filterDistrict = (req.query.district as string || '').trim();

    const whereClause: any = {};
    if (filterUserId) {
      whereClause.userId = filterUserId;
    }
    if (filterCategory && filterCategory !== 'All') {
      whereClause.category = { contains: filterCategory };
    }
    if (filterDistrict && filterDistrict !== 'All') {
      whereClause.district = { contains: filterDistrict };
    }
    if (searchQuery) {
      whereClause.OR = [
        { title: { contains: searchQuery } },
        { description: { contains: searchQuery } },
        { location: { contains: searchQuery } },
        { district: { contains: searchQuery } },
        { category: { contains: searchQuery } },
      ];
    }

    const filterCollegeName = (req.query.collegeName as string || req.query.college as string || '').trim();
    const filterIndustryName = (req.query.industryName as string || req.query.companyName as string || '').trim();

    if (filterCollegeName) {
      whereClause.acceptedCollegeName = { contains: filterCollegeName };
    }
    if (filterIndustryName) {
      whereClause.acceptedIndustryName = { contains: filterIndustryName };
    }

    const posts = await prisma.post.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true, companyName: true, role: true } },
        industryMatches: { orderBy: { matchScore: 'desc' } },
        collaborationMessages: { orderBy: { createdAt: 'asc' }, take: 30 },
        collegeProjects: true,
        industrySponsorships: true,
        governmentSanctions: true,
        _count: { select: { likes: true, comments: true } },
      },
    });

    const total = await prisma.post.count({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
    });

    let likedPostIds: Set<string> = new Set();
    if (req.user) {
      const userLikes = await prisma.like.findMany({
        where: { userId: req.user.id, postId: { in: posts.map((p) => p.id) } },
        select: { postId: true },
      });
      likedPostIds = new Set(userLikes.map((l) => l.postId));
    }

    // Auto-generate 10 industry matches for posts that have none
    for (const p of posts) {
      if (!p.industryMatches || p.industryMatches.length === 0) {
        await ensureIndustryMatches(p.id, p.category, p.title);
      }
    }

    const mapped = posts.map((post: any) => ({
      ...post,
      likeCount: post._count?.likes || 0,
      commentCount: post._count?.comments || 0,
      likedByMe: likedPostIds.has(post.id),
      approvalMemo: generateProblemSpecificApprovalMemo(post),
      matchedTamilNaduColleges: matchCollegesForProblem(post.category, post.title, 5),
    }));

    res.json({ posts: mapped, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[GET POSTS ERROR]', err);
    res.status(500).json({ error: 'Failed to load posts.' });
  }
};

// DELETE /api/posts/:id — Delete complaint permanently from database
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.user?.id;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ error: 'Complaint post not found.' });
    }

    // Check authorization: must be creator, admin, or government authority
    const userRole = (req.user?.role || '').toUpperCase();
    if (userId && post.userId !== userId && userRole !== 'ADMIN' && userRole !== 'GOVERNMENT' && userRole !== 'SUPERADMIN') {
      return res.status(403).json({ error: 'You are not authorized to delete this complaint.' });
    }

    // Clean up dependent records
    await prisma.like.deleteMany({ where: { postId } });
    await prisma.comment.deleteMany({ where: { postId } });
    await prisma.industryMatch.deleteMany({ where: { postId } });
    await prisma.postStatusHistory.deleteMany({ where: { postId } });
    await prisma.collaborationMessage.deleteMany({ where: { postId } });
    await prisma.post.delete({ where: { id: postId } });

    console.log(`🗑️ [DELETE POST] Post ${postId} permanently deleted from database`);

    res.json({ message: 'Complaint successfully deleted from database.', id: postId });
  } catch (err: any) {
    console.error('[DELETE POST ERROR]', err);
    res.status(500).json({ error: 'Failed to delete complaint from database.' });
  }
};

// PUT /api/posts/:id — Edit an existing complaint
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.user?.id;
    
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ error: 'Complaint post not found.' });
    }

    // Only creator can edit
    if (post.userId !== userId) {
      return res.status(403).json({ error: 'You can only edit your own complaints.' });
    }

    const { title, description, category, location, district, state } = req.body;
    
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (location !== undefined) updateData.location = location;
    if (district !== undefined) updateData.district = district;
    if (state !== undefined) updateData.state = state;
    
    if (req.file) {
      updateData.imageUrl = req.file.path; // Cloudinary secure URL
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    const formattedPost = {
      ...updatedPost,
      likeCount: updatedPost._count?.likes || 0,
      commentCount: updatedPost._count?.comments || 0,
    };

    console.log(`📝 [EDIT POST] Post ${postId} updated successfully`);

    res.json({ message: 'Complaint successfully updated.', post: formattedPost });
  } catch (err: any) {
    console.error('[UPDATE POST ERROR]', err);
    res.status(500).json({ error: 'Failed to update complaint.' });
  }
};

// POST /api/posts — Create a new complaint
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, location, district, state } = req.body;
    const userId = req.user!.id;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }
    let imageUrl: string | undefined;
    if (req.file) {
      imageUrl = req.file.path; // Cloudinary secure URL
    }

    const post = await prisma.post.create({
      data: {
        userId,
        title,
        description,
        category: category || 'General',
        location,
        district,
        state,
        imageUrl,
        status: 'SUBMITTED',
        statusMessage: 'Complaint submitted. AI analysis will begin shortly...',
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    await prisma.postStatusHistory.create({
      data: { postId: post.id, status: 'SUBMITTED', message: 'Complaint submitted by citizen.' },
    });

    await ensureIndustryMatches(post.id, post.category, post.title);
    triggerAiAnalysis(post.id).catch((e) => console.error('[AI TRIGGER ERROR]', e));

    // Emit real-time event
    io.emit('new-post', post);

    res.status(201).json({ message: 'Complaint posted successfully!', post });
  } catch (err) {
    console.error('[CREATE POST ERROR]', err);
    res.status(500).json({ error: 'Failed to post complaint.' });
  }
};

// GET /api/posts/:id — Single post with full industry matches, memo & messages
export const getPost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true, companyName: true } },
        statusHistory: { orderBy: { createdAt: 'desc' } },
        industryMatches: { orderBy: { matchScore: 'desc' } },
        collaborationMessages: { orderBy: { createdAt: 'asc' } },
        _count: { select: { likes: true, comments: true } },
      },
    });
    if (!post) return res.status(404).json({ error: 'Post not found.' });

    if (!post.industryMatches || post.industryMatches.length === 0) {
      await ensureIndustryMatches(post.id, post.category, post.title);
    }

    await prisma.post.update({ where: { id: req.params.id }, data: { viewCount: { increment: 1 } } });

    res.json({
      post: {
        ...post,
        likeCount: (post as any)._count?.likes || 0,
        commentCount: (post as any)._count?.comments || 0,
        approvalMemo: generateProblemSpecificApprovalMemo(post),
        matchedTamilNaduColleges: matchCollegesForProblem(post.category, post.title, 5),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load post.' });
  }
};

// Task 2: POST /api/posts/:id/college/reject — College rejects a challenge
export const rejectCollegeChallenge = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const { collegeName, reason } = req.body;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ error: 'Challenge not found.' });

    const message = `Rejected by ${collegeName || 'University Lab'}: ${reason || 'Capacity limit / Outside research domain'}. Re-queued for other academic institutions.`;

    await prisma.postStatusHistory.create({
      data: {
        postId,
        status: 'UNIVERSITY_MATCHING',
        message,
        actor: collegeName || 'University Lab',
      },
    });

    await prisma.collaborationMessage.create({
      data: {
        postId,
        senderRole: 'COLLEGE',
        senderName: collegeName || 'University Lab',
        text: `❌ Challenge declined: "${reason || 'Outside research scope'}". Opportunity returned to open academic matching pool.`,
      },
    });

    res.json({ message: 'Challenge successfully declined.', postId });
  } catch (err) {
    console.error('[COLLEGE REJECT ERROR]', err);
    res.status(500).json({ error: 'Failed to decline challenge.' });
  }
};

// Task 2: POST /api/posts/:id/industry/reject — Industry declines a match
export const rejectIndustryChallenge = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const { companyName, reason } = req.body;

    if (!companyName) return res.status(400).json({ error: 'Company name is required.' });

    // Mark this industry match as DECLINED
    await prisma.industryMatch.updateMany({
      where: { postId, industryName: { contains: companyName } },
      data: {
        status: 'DECLINED',
        lockMessage: `Declined by ${companyName}: ${reason || 'Budget allocated to other CSR verticals'}.`,
      },
    });

    await prisma.collaborationMessage.create({
      data: {
        postId,
        senderRole: 'INDUSTRY',
        senderName: companyName,
        text: `ℹ️ ${companyName} declined this collaboration opportunity (${reason || 'Budget allocated elsewhere'}). Challenge remains OPEN for remaining invited partners.`,
      },
    });

    res.json({ message: `Collaboration declined by ${companyName}.`, postId });
  } catch (err) {
    console.error('[INDUSTRY REJECT ERROR]', err);
    res.status(500).json({ error: 'Failed to decline industry match.' });
  }
};

// Task 4 & 5: POST /api/posts/:id/industry/accept — First-Come First-Served Industry Acceptance & Locking
export const acceptIndustryChallenge = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const { companyName, sponsorType, grantAmount, mentorLead, notes } = req.body;

    if (!companyName) {
      return res.status(400).json({ error: 'Company Name is required.' });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { industryMatches: true },
    });

    if (!post) {
      return res.status(404).json({ error: 'Challenge not found.' });
    }

    // TASK 5: CHECK IF ALREADY ADOPTED BY ANOTHER INDUSTRY
    if (post.acceptedIndustryName && post.acceptedIndustryName !== companyName) {
      return res.status(409).json({
        error: `This challenge has already been adopted by ${post.acceptedIndustryName}. The collaboration opportunity is now closed.`,
        lockedBy: post.acceptedIndustryName,
      });
    }

    const cleanCompany = companyName.trim();
    const cleanGrant = grantAmount?.trim() || 'CSR Grant Fund';
    const cleanSponsor = sponsorType?.trim() || 'CSR Grant & Manufacturing';
    const statusMsg = `Adopted by ${cleanCompany} (${cleanSponsor}: ${cleanGrant}). Lead: ${mentorLead || 'Executive Mentor'}.`;

    // 1. Update Post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'INDUSTRY_ACCEPTED',
        acceptedIndustryName: cleanCompany,
        statusMessage: statusMsg,
      },
    });

    // 1b. Record in isolated IndustrySponsorship tenant table
    try {
      let industryUserId = req.user?.id;
      if (!industryUserId) {
        const found = await prisma.user.findFirst({ where: { companyName: { contains: cleanCompany } } })
          || await prisma.user.findFirst({ where: { role: 'INDUSTRY' } });
        industryUserId = found?.id;
      }
      if (industryUserId) {
        await prisma.industrySponsorship.upsert({
          where: { industryId_postId: { industryId: industryUserId, postId } },
          update: {
            companyName: cleanCompany,
            grantAmount: cleanGrant,
            mentorLead: mentorLead || 'Executive Mentor',
            sponsorType: cleanSponsor,
            notes: notes || null,
            status: 'ACTIVE',
          },
          create: {
            industryId: industryUserId,
            companyName: cleanCompany,
            postId,
            grantAmount: cleanGrant,
            mentorLead: mentorLead || 'Executive Mentor',
            sponsorType: cleanSponsor,
            notes: notes || null,
            status: 'ACTIVE',
          },
        });
      }
    } catch (e) {
      console.warn('[INDUSTRY SPONSORSHIP RECORD WARN]', e);
    }

    // 2. Update Industry Matches: Mark this one ACCEPTED, all others LOCKED_OUT
    await prisma.industryMatch.updateMany({
      where: { postId, industryName: { contains: cleanCompany } },
      data: { status: 'ACCEPTED' },
    });

    await prisma.industryMatch.updateMany({
      where: { postId, NOT: { industryName: { contains: cleanCompany } } },
      data: {
        status: 'LOCKED_OUT',
        lockMessage: `AI Notice: This challenge was adopted by ${cleanCompany}. Collaboration window is closed.`,
      },
    });

    // 3. Problem-Specific Approval Memo
    const approvalMemo = generateProblemSpecificApprovalMemo({
      title: post.title,
      category: post.category,
      location: post.location || undefined,
      acceptedCollegeName: post.acceptedCollegeName || undefined,
      acceptedIndustryName: cleanCompany,
    });

    // 4. Post System AI Lock Message & Industry Welcome in Collaboration Chat
    await prisma.collaborationMessage.create({
      data: {
        postId,
        senderRole: 'AI',
        senderName: 'Connecting Social Problem AI Engine',
        text: `🔒 Challenge Exclusively Locked: ${cleanCompany} was the FIRST industry partner to accept this challenge. All other 9 invited industry partners have been notified that this opportunity is now closed.\n\n${approvalMemo}`,
      },
    });

    await prisma.collaborationMessage.create({
      data: {
        postId,
        senderRole: 'INDUSTRY',
        senderName: `${mentorLead || 'CSR Lead'} (${cleanCompany})`,
        text: `🤝 Greetings from ${cleanCompany}! We have officially committed ${cleanGrant} under ${cleanSponsor}. ${notes ? `Notes: "${notes}"` : "We look forward to working closely with the university research team on the prototype rollout."}`,
      },
    });

    // 5. Log in PostStatusHistory
    await prisma.postStatusHistory.create({
      data: {
        postId,
        status: 'INDUSTRY_ACCEPTED',
        message: statusMsg,
        actor: cleanCompany,
      },
    });

    console.log(`✅ [INDUSTRY ACCEPT] Challenge ${postId} locked by ${cleanCompany}`);

    res.status(200).json({
      message: `Challenge successfully adopted by ${cleanCompany}!`,
      post: updatedPost,
      approvalMemo,
    });
  } catch (err: any) {
    console.error('[INDUSTRY ACCEPT ERROR]', err);
    res.status(500).json({ error: 'Failed to accept industry challenge.' });
  }
};

// GET /api/posts/:id/collaboration-messages
export const getCollaborationMessages = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const messages = await prisma.collaborationMessage.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load collaboration messages.' });
  }
};

// POST /api/posts/:id/collaboration-messages — College <-> Industry Chat
export const sendCollaborationMessage = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const { senderRole, senderName, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message text cannot be empty.' });
    }

    const message = await prisma.collaborationMessage.create({
      data: {
        postId,
        senderRole: senderRole || 'INDUSTRY',
        senderName: senderName || 'Partner',
        text: text.trim(),
      },
    });

    res.status(201).json({ message });
  } catch (err) {
    console.error('[SEND MESSAGE ERROR]', err);
    res.status(500).json({ error: 'Failed to send collaboration message.' });
  }
};

// POST /api/posts/:id/like
export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.user!.id;

    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      const finalCount = await prisma.like.count({ where: { postId } });
      io.emit('post-liked', { postId, likeCount: finalCount, delta: -1 });
      res.json({ liked: false, likeCount: finalCount });
    } else {
      await prisma.like.create({ data: { userId, postId } });
      const finalCount = await prisma.like.count({ where: { postId } });
      io.emit('post-liked', { postId, likeCount: finalCount, delta: 1 });
      res.json({ liked: true, likeCount: finalCount });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update like.' });
  }
};

// GET /api/posts/:id/likes — Return users who liked this post
export const getPostLikes = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const likes = await prisma.like.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            role: true,
            companyName: true,
          },
        },
      },
    });

    const users = likes.map((l) => ({
      ...l.user,
      likedAt: l.createdAt,
    }));

    res.json({ users, count: users.length });
  } catch (err) {
    console.error('[GET POST LIKES ERROR]', err);
    res.status(500).json({ error: 'Failed to load post likes.' });
  }
};

// GET /api/posts/:id/comments
export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.user?.id;

    // Fetch top-level comments and their replies
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true, role: true } },
        _count: { select: { commentLikes: true } },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true, role: true } },
            commentLikes: userId ? { where: { userId } } : false,
            _count: { select: { commentLikes: true } },
          },
        },
        commentLikes: userId ? { where: { userId } } : false,
      },
    });

    const mapped = comments.map((c: any) => ({
      id: c.id,
      postId: c.postId,
      parentId: c.parentId,
      text: c.text,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      likeCount: c._count?.commentLikes || 0,
      likedByMe: Array.isArray(c.commentLikes) && c.commentLikes.length > 0,
      user: c.user,
      replies: (c.replies || []).map((r: any) => ({
        id: r.id,
        postId: r.postId,
        parentId: r.parentId,
        text: r.text,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        likeCount: r._count?.commentLikes || 0,
        likedByMe: Array.isArray(r.commentLikes) && r.commentLikes.length > 0,
        user: r.user,
      })),
    }));

    res.json({ comments: mapped });
  } catch (err) {
    console.error('[GET COMMENTS ERROR]', err);
    res.status(500).json({ error: 'Failed to load comments.' });
  }
};

// POST /api/posts/:id/comments
export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { text, parentId } = req.body;
    const userId = req.user!.id;
    const postId = req.params.id;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required.' });
    }

    const comment = await prisma.comment.create({
      data: {
        userId,
        postId,
        text: text.trim(),
        parentId: parentId || null,
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true, role: true } },
      },
    });

    // Removed cached commentCount increment

    const newComment = {
      ...comment,
      likeCount: 0,
      likedByMe: false,
      replies: [],
    };

    // Emit real-time event
    io.emit('new-comment', { postId, comment: newComment });

    res.status(201).json({
      comment: newComment,
    });
  } catch (err) {
    console.error('[ADD COMMENT ERROR]', err);
    res.status(500).json({ error: 'Failed to add comment.' });
  }
};

// POST /api/posts/comments/:commentId/like
export const toggleCommentLike = async (req: AuthRequest, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user!.id;

    const existing = await prisma.commentLike.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });

    if (existing) {
      await prisma.commentLike.delete({ where: { id: existing.id } });
      const count = await prisma.commentLike.count({ where: { commentId } });
      res.json({ liked: false, likeCount: count });
    } else {
      await prisma.commentLike.create({
        data: { userId, commentId },
      });
      const count = await prisma.commentLike.count({ where: { commentId } });
      res.json({ liked: true, likeCount: count });
    }
  } catch (err: any) {
    console.error('[COMMENT LIKE ERROR]', err);
    res.status(500).json({ error: 'Failed to update comment like.' });
  }
};

// DELETE /api/posts/comments/:commentId
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user?.id;
    const userRole = (req.user?.role || '').toUpperCase();

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return res.status(404).json({ error: 'Comment not found.' });

    if (userId && comment.userId !== userId && userRole !== 'ADMIN' && userRole !== 'GOVERNMENT') {
      return res.status(403).json({ error: 'Unauthorized to delete this comment.' });
    }

    // Clean up likes and child replies
    await prisma.commentLike.deleteMany({ where: { commentId } });
    await prisma.comment.deleteMany({ where: { parentId: commentId } });
    await prisma.comment.delete({ where: { id: commentId } });
    // Removed cached commentCount decrement

    res.json({ message: 'Comment deleted.', commentId });
  } catch (err: any) {
    console.error('[DELETE COMMENT ERROR]', err);
    res.status(500).json({ error: 'Failed to delete comment.' });
  }
};

// POST /api/posts/:id/share
export const incrementShare = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.post.update({
      where: { id: req.params.id },
      data: { shareCount: { increment: 1 } },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update share count.' });
  }
};

// PATCH /api/posts/:id/status
export const updatePostStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, message, actor, beneficiaries, benefitCount, collegeName } = req.body;
    const postId = req.params.id;

    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        status,
        statusMessage: message || `Status updated to ${status}`,
        acceptedCollegeName: collegeName !== undefined ? collegeName : undefined,
        beneficiaries: beneficiaries !== undefined ? beneficiaries : undefined,
        benefitCount: benefitCount !== undefined ? benefitCount : undefined,
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    // If College Accepted, ensure 10 industry matches are ready & AI message logged
    if (status === 'UNIVERSITY_ACCEPTED') {
      await ensureIndustryMatches(postId, updated.category, updated.title);
      const memo = generateProblemSpecificApprovalMemo({
        title: updated.title,
        category: updated.category,
        location: updated.location || undefined,
        acceptedCollegeName: collegeName || actor || 'University Research Lab',
      });

      await prisma.collaborationMessage.create({
        data: {
          postId,
          senderRole: 'COLLEGE',
          senderName: collegeName || actor || 'University Research Lab',
          text: `🎓 University R&D Team has accepted this challenge.\n\n${memo}`,
        },
      });
    }

    await prisma.postStatusHistory.create({
      data: {
        postId,
        status,
        message: message || `Status updated to ${status}`,
        actor: actor || req.user?.email || 'System Actor',
      },
    });

    // Isolated College Project Record
    if (collegeName || (req.user && req.user.role === 'UNIVERSITY') || status.startsWith('UNIVERSITY_') || status === 'PROTOTYPING' || status === 'TESTING') {
      try {
        let collegeUserId = req.user?.id;
        if (!collegeUserId) {
          const found = await prisma.user.findFirst({ where: { role: 'UNIVERSITY' } });
          collegeUserId = found?.id;
        }
        if (collegeUserId) {
          const cleanCollegeName = collegeName || (req.user as any)?.name || actor || 'Academic Research Lab';
          await prisma.collegeProject.upsert({
            where: { collegeId_postId: { collegeId: collegeUserId, postId } },
            update: {
              collegeName: cleanCollegeName,
              stage: status,
              status: status === 'COMPLETED' ? 'COMPLETED' : 'ACTIVE',
              teamName: actor || cleanCollegeName,
              facultyGuide: req.body.facultyGuide || null,
              notes: message || null,
            },
            create: {
              collegeId: collegeUserId,
              collegeName: cleanCollegeName,
              postId,
              stage: status,
              status: status === 'COMPLETED' ? 'COMPLETED' : 'ACTIVE',
              teamName: actor || cleanCollegeName,
              facultyGuide: req.body.facultyGuide || null,
              notes: message || null,
            },
          });
        }
      } catch (e) {
        console.warn('[COLLEGE PROJECT RECORD WARN]', e);
      }
    }

    // Isolated Government Sanction Record
    if (status === 'GOVT_APPROVED' || status === 'GOVT_REVIEW' || status === 'IMPLEMENTATION' || req.body.sanctionNumber) {
      try {
        let govtUserId = req.user?.id;
        if (!govtUserId) {
          const found = await prisma.user.findFirst({ where: { role: 'GOVERNMENT' } });
          govtUserId = found?.id;
        }
        if (govtUserId) {
          const authName = req.body.authorityName || actor || 'Municipal Authority';
          await prisma.governmentSanction.upsert({
            where: { govtId_postId: { govtId: govtUserId, postId } },
            update: {
              authorityName: authName,
              department: req.body.department || null,
              officerName: actor || req.body.officerName || null,
              sanctionNumber: req.body.sanctionNumber || null,
              scheme: req.body.scheme || null,
              status,
              notes: message || null,
            },
            create: {
              govtId: govtUserId,
              authorityName: authName,
              department: req.body.department || null,
              officerName: actor || req.body.officerName || null,
              postId,
              sanctionNumber: req.body.sanctionNumber || null,
              scheme: req.body.scheme || null,
              status,
              notes: message || null,
            },
          });
        }
      } catch (e) {
        console.warn('[GOVT SANCTION RECORD WARN]', e);
      }
    }

    res.json({ message: 'Status updated successfully', post: updated });
  } catch (err) {
    console.error('[UPDATE STATUS ERROR]', err);
    res.status(500).json({ error: 'Failed to update post status.' });
  }
};

// --- Internal: Simulated AI Analysis Pipeline ---
async function triggerAiAnalysis(postId: string) {
  await new Promise((r) => setTimeout(r, 2000));
  await prisma.post.update({
    where: { id: postId },
    data: { status: 'AI_ANALYZING', statusMessage: 'AI is analysing the problem...' },
  });
  await prisma.postStatusHistory.create({
    data: { postId, status: 'AI_ANALYZING', message: 'AI analysis started.' },
  });

  await new Promise((r) => setTimeout(r, 4000));
  await prisma.post.update({
    where: { id: postId },
    data: { status: 'UNIVERSITY_MATCHING', statusMessage: 'AI is finding the best university for this problem...' },
  });
  await prisma.postStatusHistory.create({
    data: {
      postId,
      status: 'UNIVERSITY_MATCHING',
      message: 'AI analysis complete. Matching with universities and industry partners.',
    },
  });
}
