import { IncidentReport, CommunityAlert, SafetyZone, PatrolSchedule, EmergencyContact } from '../types';

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'CR-2026-0801',
    pin: '8492',
    title: 'Attempted Garage Break-in with Crowbar',
    description: 'Two individuals in dark tracksuits observed trying to force open residential garage side door on Elm Street. Security camera triggered floodlights and suspects fled on foot towards 4th Avenue.',
    category: 'burglary',
    severity: 'high',
    status: 'investigating',
    locationName: '142 Elm St, Northside Sector',
    zone: 'Northside',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    reportedAt: '2026-08-21T19:40:00.000Z',
    isAnonymous: false,
    reporterName: 'David Miller',
    reporterContact: '+91 98201 33445',
    reporterId: 'usr-citizen-101',
    firNumber: 'FIR/2026/NS-104',
    suspectDetails: {
      description: '2 males, approx 5ft 10in, black tracksuits, face masks.',
      lastSeenHeading: 'Fled East on 4th Ave towards River Walk',
      weaponsReported: false
    },
    evidenceUrls: [
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80'
    ],
    confirmationsCount: 14,
    officerAssigned: 'Inspector Vikram Kulkarni (#POL-8842)',
    policeStation: 'Northside Sector 4 Central Police Station',
    officialNotes: 'Patrol unit PCR-Alpha dispatched. Fingerprint lifting and CCTV recording seized for forensics.',
    comments: [
      {
        id: 'c1',
        author: 'Sarah Jenkins (Neighbor)',
        content: 'Saw a dark grey sedan idling near the corner around 7:30 PM with hazard lights off.',
        timestamp: '2026-08-21T20:15:00.000Z'
      },
      {
        id: 'c2',
        author: 'North Precinct In-Charge',
        isOfficial: true,
        content: 'Patrol shifts on Elm and Maple doubled between 21:00 and 04:00.',
        timestamp: '2026-08-21T20:50:00.000Z'
      }
    ]
  },
  {
    id: 'CR-2026-0802',
    pin: '5913',
    title: 'Purse & Mobile Snatching near Metro Station Gate 2',
    description: 'Victim was waiting at the bus stop when an individual on a high-speed pulsar motorbike snatched her shoulder bag containing iPhone 15, gold chain, and wallet.',
    category: 'theft',
    severity: 'high',
    status: 'fir_registered',
    locationName: 'Corner of 7th & Market Blvd, Metro Central',
    zone: 'Downtown',
    coordinates: { lat: 19.0680, lng: 72.8680 },
    reportedAt: '2026-08-21T20:10:00.000Z',
    isAnonymous: false,
    reporterName: 'Elena Rostova',
    reporterContact: '+91 99300 88712',
    reporterId: 'usr-citizen-2',
    firNumber: 'FIR/2026/DT-489',
    suspectDetails: {
      description: 'Solo rider on matte black bike with neon helmet, no rear number plate',
      lastSeenHeading: 'Sped south down Market Blvd towards flyover',
      weaponsReported: false
    },
    evidenceUrls: [],
    confirmationsCount: 18,
    officerAssigned: 'Sub-Inspector Rajesh Pawar',
    policeStation: 'Downtown Central Police Station',
    officialNotes: 'FIR registered under Section 304 BNS (Snatching). CEIR IMEI tracking initiated.',
    comments: [
      {
        id: 'c3',
        author: 'Mark T.',
        content: 'Street light near Gate 2 has been flickering; watch out after 8pm.',
        timestamp: '2026-08-21T20:45:00.000Z'
      }
    ]
  },
  {
    id: 'CR-2026-0803',
    pin: '1047',
    title: 'Fake Electricity Bill UPI Cyber Fraud',
    description: 'Received SMS stating "Electricity power will be disconnected by 9:30 PM due to unpaid bill. Call officer at 9876543210". Caller asked to install AnyDesk and debited ₹45,000 via fraudulent UPI link.',
    category: 'cyber_scam',
    severity: 'high',
    status: 'dispatched',
    locationName: 'Sector 3, Silicon Boulevard, Tech Park',
    zone: 'Tech Park',
    coordinates: { lat: 19.0820, lng: 72.8900 },
    reportedAt: '2026-08-21T21:05:00.000Z',
    isAnonymous: false,
    reporterName: 'Amitabh Sen',
    reporterContact: '+91 98401 22933',
    reporterId: 'usr-citizen-101',
    firNumber: 'CYBER/2026/9921',
    suspectDetails: {
      description: 'Fraudster used APK screen sharing app and spoofed power board SMS headers',
      lastSeenHeading: 'Remote Digital Transaction',
      weaponsReported: false
    },
    evidenceUrls: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80'
    ],
    confirmationsCount: 31,
    officerAssigned: 'Cyber Cell Officer Inspector Rao',
    policeStation: 'City Cyber Crime Police Headquarters',
    officialNotes: '1930 Helpline portal ticket logged. Beneficiary Yes Bank wallet frozen.',
    comments: []
  },
  {
    id: 'CR-2026-0804',
    pin: '3318',
    title: 'Reckless Drunk Driving & Hit-and-Run on 2nd Ring Road',
    description: 'Black SUV traveling over 110 km/h rammed into two parked auto-rickshaws and a food stall before speeding away. Stall operator sustained leg injuries.',
    category: 'traffic_hazard',
    severity: 'critical',
    status: 'investigating',
    locationName: '2nd Ring Road Junction near West End Mall',
    zone: 'West End',
    coordinates: { lat: 19.0550, lng: 72.8400 },
    reportedAt: '2026-08-21T21:15:00.000Z',
    isAnonymous: false,
    reporterName: 'Karan Mehra',
    reporterContact: '+91 97110 54321',
    firNumber: 'FIR/2026/WE-082',
    suspectDetails: {
      description: 'Black Mahindra Scorpio / Fortuner with damaged front bumper and shattered left headlight',
      vehiclePlate: 'MH-02-EE-88**',
      lastSeenHeading: 'Heading towards Highway Toll Plaza',
      weaponsReported: false
    },
    evidenceUrls: [
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=600&q=80'
    ],
    confirmationsCount: 44,
    officerAssigned: 'Highway Patrol PCR Unit #09',
    policeStation: 'West End Traffic Police Division',
    officialNotes: 'Toll plaza barriers alerted with automatic number plate recognition (ANPR) filter.',
    comments: [
      {
        id: 'c4',
        author: 'Dr. Alok (Emergency Responder)',
        content: 'Injured stall vendor admitted to City Civil Hospital, in stable condition.',
        timestamp: '2026-08-21T21:40:00.000Z'
      }
    ]
  },
  {
    id: 'CR-2026-0805',
    pin: '7721',
    title: 'Repeated Eve-Teasing and Stalking outside College Metro Gate',
    description: 'Group of three men on modified bikes making lewd comments, blocking pedestrian pathway, and filming female students returning from coaching institutes.',
    category: 'harassment',
    severity: 'high',
    status: 'dispatched',
    locationName: 'University Circle & Metro Pillar 140',
    zone: 'Riverdale',
    coordinates: { lat: 19.0900, lng: 72.8600 },
    reportedAt: '2026-08-21T21:30:00.000Z',
    isAnonymous: false,
    reporterName: 'Pooja Verma',
    reporterContact: '+91 98920 11990',
    firNumber: 'FIR/2026/RD-312',
    suspectDetails: {
      description: '3 men in early 20s on red Yamaha with loud exhaust',
      lastSeenHeading: 'Loitering near Bus Stop',
      weaponsReported: false
    },
    evidenceUrls: [],
    confirmationsCount: 22,
    officerAssigned: 'Nirbhaya Women Safety Mobile Squad #03',
    policeStation: 'Riverdale Women Special Cell',
    officialNotes: 'Women squad deployed in plain clothes. Zero FIR registered under Section 78 & 79 BNS.',
    comments: []
  },
  {
    id: 'CR-2026-0806',
    pin: '6610',
    title: 'Live Transformer Sparking & Fallen Electric Wire',
    description: 'High voltage electrical cable snapped and fallen across pedestrian sidewalk following tree branch collapse. Hazardous sparking on wet pavement.',
    category: 'public_hazard',
    severity: 'critical',
    status: 'resolved',
    locationName: 'Pine Road crosswalk, Northside Sector 4',
    zone: 'Northside',
    coordinates: { lat: 19.0790, lng: 72.8810 },
    reportedAt: '2026-08-21T18:20:00.000Z',
    isAnonymous: false,
    reporterName: 'Rohit Deshmukh',
    evidenceUrls: [],
    confirmationsCount: 52,
    officerAssigned: 'Electricity Board Emergency Squad & Fire Brigade #12',
    policeStation: 'Northside Precinct 4',
    officialNotes: 'Circuit isolated. Wire replaced and street cleared for safe traffic flow.',
    comments: []
  }
];

export const INITIAL_ALERTS: CommunityAlert[] = [
  {
    id: 'ALT-101',
    title: 'RED ALERT: Search for Hit-and-Run Suspect Vehicle (Black SUV)',
    type: 'danger',
    message: 'Law enforcement is pursuing a Black Scorpio/Fortuner with front left collision damage involved in hit-and-run at West End Ring Road. Do not confront; report sighting immediately.',
    zone: 'West End',
    issuedBy: 'Central Traffic Police & Crime Branch',
    issuedAt: '2026-08-21T21:45:00.000Z',
    isActive: true,
    actionRequired: 'Dial 100 / 112 immediately with location coordinates if spotted.'
  },
  {
    id: 'ALT-102',
    title: 'WARNING: Night Patrolling Intensified on Elm & Maple St',
    type: 'warning',
    message: 'Following attempted break-ins, joint PCR and Citizen Watch night patrols are deployed between 21:00 and 05:00. Residents are requested to lock driveway gates.',
    zone: 'Northside',
    issuedBy: 'Northside Precinct 4 Desk',
    issuedAt: '2026-08-21T20:30:00.000Z',
    isActive: true,
    actionRequired: 'Verify exterior lighting and report suspicious loitering.'
  },
  {
    id: 'ALT-103',
    title: 'ADVISORY: Electricity Bill & APK Phishing Fraud Wave',
    type: 'advisory',
    message: 'Cyber scammers sending SMS threatening disconnection of power bills. Power boards never ask citizens to install AnyDesk or click APK links. Report to 1930.',
    zone: 'All Sectors',
    issuedBy: 'State Cyber Crime Investigation Cell',
    issuedAt: '2026-08-21T17:00:00.000Z',
    isActive: true,
    actionRequired: 'Do not click unknown links or share OTPs over phone.'
  }
];

export const SAFETY_ZONES: SafetyZone[] = [
  {
    id: 'zone-northside',
    name: 'Northside Sector',
    safetyScore: 86,
    recentIncidentsCount: 4,
    activePatrols: 3,
    coordinates: { lat: 19.0760, lng: 72.8777 },
    safeHavens: [
      {
        name: 'Sector 4 Central Police Station',
        type: 'police',
        address: '500 Highland Avenue, Northside',
        phone: '100 / +91 22 2640 1000',
        is24Hours: true,
        lat: 19.0780,
        lng: 72.8790
      },
      {
        name: 'City Care Multi-Speciality Hospital',
        type: 'hospital',
        address: '220 North Health Blvd',
        phone: '108 / +91 22 2640 5500',
        is24Hours: true,
        lat: 19.0750,
        lng: 72.8740
      },
      {
        name: 'Fire Station #12',
        type: 'fire_station',
        address: '105 Pine Road',
        phone: '101 / +91 22 2640 9101',
        is24Hours: true,
        lat: 19.0795,
        lng: 72.8805
      }
    ]
  },
  {
    id: 'zone-downtown',
    name: 'Downtown Central',
    safetyScore: 78,
    recentIncidentsCount: 8,
    activePatrols: 5,
    coordinates: { lat: 19.0680, lng: 72.8680 },
    safeHavens: [
      {
        name: 'Central Metro Police Commissionerate',
        type: 'police',
        address: '100 Civic Center Plaza, Downtown',
        phone: '100 / 112',
        is24Hours: true,
        lat: 19.0690,
        lng: 72.8700
      },
      {
        name: 'Downtown Transit Security Kiosk & Safe Haven',
        type: 'community_post',
        address: 'Metro Station Lower Concourse Gate 1',
        phone: '1090 / +91 22 2840 2200',
        is24Hours: true,
        lat: 19.0675,
        lng: 72.8670
      }
    ]
  },
  {
    id: 'zone-techpark',
    name: 'Tech Park & Silicon Hub',
    safetyScore: 94,
    recentIncidentsCount: 2,
    activePatrols: 4,
    coordinates: { lat: 19.0820, lng: 72.8900 },
    safeHavens: [
      {
        name: 'Cyber Crime Police Headquarters',
        type: 'police',
        address: 'Cyber Towers, Sector 3, Silicon Boulevard',
        phone: '1930 / +91 22 2920 1930',
        is24Hours: true,
        lat: 19.0830,
        lng: 72.8920
      },
      {
        name: 'Tech Park 24/7 Security Command Hub',
        type: 'community_post',
        address: '1000 Silicon Circle Gate 3',
        phone: '+91 22 2920 8800',
        is24Hours: true,
        lat: 19.0815,
        lng: 72.8885
      }
    ]
  },
  {
    id: 'zone-westend',
    name: 'West End Ring Road',
    safetyScore: 81,
    recentIncidentsCount: 5,
    activePatrols: 3,
    coordinates: { lat: 19.0550, lng: 72.8400 },
    safeHavens: [
      {
        name: 'West End Police Station & Traffic Chowki',
        type: 'police',
        address: '740 West End Parkway',
        phone: '100 / 1073',
        is24Hours: true,
        lat: 19.0560,
        lng: 72.8420
      }
    ]
  },
  {
    id: 'zone-riverdale',
    name: 'Riverdale Academic Area',
    safetyScore: 89,
    recentIncidentsCount: 3,
    activePatrols: 3,
    coordinates: { lat: 19.0900, lng: 72.8600 },
    safeHavens: [
      {
        name: 'Riverdale Women Safety Chowki & Nirbhaya Booth',
        type: 'community_post',
        address: '45 River Promenade near University Gate',
        phone: '1090 / 1091',
        is24Hours: true,
        lat: 19.0910,
        lng: 72.8620
      }
    ]
  }
];

export const INITIAL_PATROLS: PatrolSchedule[] = [
  {
    id: 'pat-1',
    zone: 'Northside',
    leader: 'Inspector Vikram Kulkarni (Police Lead)',
    date: 'Tonight',
    timeSlot: '21:00 - 23:30',
    volunteersEnrolled: ['David M.', 'Atharv U.', 'Sarah J.'],
    maxVolunteers: 6,
    status: 'in_progress'
  },
  {
    id: 'pat-2',
    zone: 'Downtown',
    leader: 'Sub-Inspector Pawar (PCR-04)',
    date: 'Tonight',
    timeSlot: '22:00 - 02:00',
    volunteersEnrolled: ['S. Lawson', 'R. Diaz', 'K. Patel', 'M. Vance'],
    maxVolunteers: 6,
    status: 'upcoming'
  },
  {
    id: 'pat-3',
    zone: 'Riverdale',
    leader: 'Nirbhaya Mobile Squad Officer Rekha',
    date: 'Tomorrow',
    timeSlot: '19:00 - 21:00',
    volunteersEnrolled: ['Pooja V.', 'Lisa C.'],
    maxVolunteers: 5,
    status: 'upcoming'
  }
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'ec-1',
    name: 'Police Emergency Control Room (100 / 112)',
    relationOrRole: 'National Police Dispatch Hotline',
    phone: '100',
    isPrimary: true,
    category: 'national'
  },
  {
    id: 'ec-2',
    name: 'National Emergency Response System (NERS)',
    relationOrRole: 'Unified Police, Fire & Medical 112',
    phone: '112',
    isPrimary: true,
    category: 'national'
  },
  {
    id: 'ec-3',
    name: 'Women Helpline & Powerline (1090 / 1091)',
    relationOrRole: 'Women Safety & Anti-Eve Teasing Cell',
    phone: '1090',
    isPrimary: true,
    category: 'national'
  },
  {
    id: 'ec-4',
    name: 'National Cyber Crime & Financial Fraud Helpline',
    relationOrRole: 'Immediate UPI/Bank Lien & Fraud Hotline',
    phone: '1930',
    isPrimary: true,
    category: 'precinct'
  },
  {
    id: 'ec-5',
    name: 'Child Helpline (Childline 24/7)',
    relationOrRole: 'Child Abuse & POCSO Emergency Care',
    phone: '1098',
    category: 'medical'
  },
  {
    id: 'ec-6',
    name: 'Emergency Medical & Ambulance (108)',
    relationOrRole: 'Free Govt Paramedic & Trauma Care',
    phone: '108',
    category: 'medical'
  },
  {
    id: 'ec-7',
    name: 'Fire & Disaster Rescue (101)',
    relationOrRole: 'Fire Brigade & Hazard Control',
    phone: '101',
    category: 'national'
  },
  {
    id: 'ec-8',
    name: 'National Highway Accident Helpline (1073)',
    relationOrRole: 'Expressway & Highway Patrol Support',
    phone: '1073',
    category: 'precinct'
  }
];
