import { CrimeLawEntry } from '../types';

export const CRIME_LAWS_KNOWLEDGE_BASE: CrimeLawEntry[] = [
  {
    id: 'law-cyber-fraud',
    crimeName: 'Cyber Fraud, Phishing & Online Financial Scam',
    keywords: ['cyber', 'scam', 'fraud', 'phishing', 'upi', 'credit card', 'otp', 'online banking', 'hack', 'crypto fraud', 'atm scam'],
    applicableAct: 'Information Technology Act, 2000 & Bharatiya Nyaya Sanhita (BNS) / IPC',
    sections: {
      ipcSection: 'Section 420 (Cheating and dishonestly inducing delivery of property)',
      bnsSection: 'Section 318 (Cheating) & Section 319 (Cheating by personation)',
      itActSection: 'Section 66C (Identity Theft) & Section 66D (Cheating by personation using computer resource)'
    },
    definition: 'Dishonestly deceiving an individual using digital mediums, fake websites, malware, OTP capture, social engineering, or payment spoofing to extract money or sensitive banking credentials.',
    punishment: 'Imprisonment up to 3 years to 7 years + Heavy monetary fine under IT Act Section 66D & BNS Section 318(4).',
    bailable: 'Non-Bailable',
    cognizable: 'Cognizable (Police can arrest without warrant)',
    courtTriableBy: 'Magistrate First Class / Special Cyber Crime Court',
    reportingProcedure: [
      'Immediately dial national Cyber Helpline: 1930 within the golden hour to freeze fraudulent bank transactions.',
      'Lodge a formal cyber complaint on the National Cyber Crime Reporting Portal (cybercrime.gov.in).',
      'Preserve screenshots of transaction receipts, SMS alerts, UPI reference numbers (UTR), and scammer phone numbers.',
      'File an e-FIR or Zero FIR at the nearest Police Cyber Crime Cell.'
    ],
    immediateCitizenAction: [
      'Block your debit/credit card and freeze netbanking immediately.',
      'Do NOT delete SMS or WhatsApp chat logs with the fraudster.',
      'Inform your bank branch in writing within 24 hours to secure zero-liability protection.'
    ],
    suggestedLawyerSpecialization: 'Cyber Crime & Financial Fraud Advocate',
    emergencyHelpline: '1930 (Cyber Fraud Helpline) / 100 / 112'
  },
  {
    id: 'law-theft',
    crimeName: 'Theft & Snatching of Personal Property',
    keywords: ['theft', 'stealing', 'stolen', 'snatching', 'chain snatching', 'mobile snatching', 'pickpocket', 'vehicle theft', 'bike stolen'],
    applicableAct: 'Bharatiya Nyaya Sanhita (BNS), 2023 / Indian Penal Code (IPC), 1860',
    sections: {
      ipcSection: 'Section 378 (Definition), Section 379 (Punishment for Theft)',
      bnsSection: 'Section 303(2) (Theft) & Section 304 (Snatching with force)'
    },
    definition: 'Intending to take dishonestly any movable property out of the possession of any person without that person consent.',
    punishment: 'Imprisonment for a term which may extend to 3 years, or with fine, or with both. In case of Snatching (BNS 304), imprisonment up to 3 to 7 years.',
    bailable: 'Non-Bailable (for Snatching / aggravated theft) / Bailable for petty first-time theft with magistrate discretion',
    cognizable: 'Cognizable (Police can arrest without warrant)',
    courtTriableBy: 'Any Magistrate',
    reportingProcedure: [
      'Call Police Control Room at 100 or 112 immediately with location description.',
      'Provide vehicle IMEI number (for mobile phones) or Engine/Chassis number for vehicles.',
      'File an FIR at the local police station having jurisdiction over the area where the theft took place.',
      'Obtain a signed and stamped copy of the FIR for insurance claims and legal records (free of cost).'
    ],
    immediateCitizenAction: [
      'For stolen phones: Block IMEI via CEIR portal (ceir.sancharsaathi.gov.in).',
      'For vehicles: Notify insurance provider within 24 hours of filing FIR.',
      'Check local CCTV camera angles nearby shops and request footage preservation.'
    ],
    suggestedLawyerSpecialization: 'Criminal Defense & Property Recovery Advocate',
    emergencyHelpline: '100 / 112'
  },
  {
    id: 'law-burglary',
    crimeName: 'House-Breaking, Trespass & Night Burglary',
    keywords: ['burglary', 'house breaking', 'break-in', 'trespass', 'lock broken', 'robbery at home'],
    applicableAct: 'Bharatiya Nyaya Sanhita (BNS), 2023 / Indian Penal Code (IPC), 1860',
    sections: {
      ipcSection: 'Section 445 (House-breaking), Section 457 (Lurking house-trespass or house-breaking by night)',
      bnsSection: 'Section 329 (House-trespass) & Section 331 (House-breaking by night to commit offence)'
    },
    definition: 'Entering or breaking into a building, tent, or vessel used for human dwelling or property custody with intent to commit an offence.',
    punishment: 'Imprisonment for a term which may extend to 5 years to 14 years + fine (heavier punishment if committed between sunset and sunrise).',
    bailable: 'Non-Bailable',
    cognizable: 'Cognizable',
    courtTriableBy: 'Magistrate First Class / Sessions Court',
    reportingProcedure: [
      'Do NOT touch door handles, broken locks, or drawers to preserve latent fingerprints.',
      'Dial 100 immediately for forensic and dog squad inspection.',
      'Prepare an itemized list of all missing jewelry, cash, electronics, and documents with approximate value.'
    ],
    immediateCitizenAction: [
      'Step out of the premises if you suspect intruders are still inside.',
      'Request CCTV footage from security gates and neighboring houses.',
      'File formal FIR under Section 331 BNS / 457 IPC.'
    ],
    suggestedLawyerSpecialization: 'Criminal Trial & Insurance Recovery Specialist',
    emergencyHelpline: '100 / 112'
  },
  {
    id: 'law-assault-violence',
    crimeName: 'Assault, Physical Battery & Grievous Hurt',
    keywords: ['assault', 'attack', 'battery', 'beating', 'violence', 'hurt', 'fight', 'physical harm', 'injury', 'weapon attack'],
    applicableAct: 'Bharatiya Nyaya Sanhita (BNS), 2023 / Indian Penal Code (IPC), 1860',
    sections: {
      ipcSection: 'Section 323 (Voluntarily causing hurt), Section 325 (Grievous hurt), Section 307 (Attempt to murder)',
      bnsSection: 'Section 115 (Voluntarily causing hurt), Section 117 (Grievous hurt), Section 109 (Attempt to murder)'
    },
    definition: 'Making any gesture or preparation causing apprehension of criminal force, or causing bodily pain, disease, fracture, permanent disfiguration, or grievous life-threatening injury.',
    punishment: 'Simple hurt: Up to 1 year + fine. Grievous hurt: Up to 7 years + fine. Using dangerous weapons: Up to 10 years / Life imprisonment.',
    bailable: 'Simple hurt is Bailable; Grievous hurt / Weapon assault is Non-Bailable',
    cognizable: 'Cognizable (for Grievous hurt / Assault with weapon)',
    courtTriableBy: 'Magistrate First Class / Court of Session',
    reportingProcedure: [
      'Seek immediate medical care at a Government/Private Hospital and obtain a Medico-Legal Case (MLC) Certificate.',
      'Hospital authorities will automatically send an emergency police intimation (DD Entry).',
      'Lodge a statement with the investigating police officer for FIR registration under Sections 115/117 BNS.',
      'Document all visible bruises, cuts, and medical scan reports.'
    ],
    immediateCitizenAction: [
      'Do not delay MLC examination; fresh physical evidence is critical.',
      'Record names and contact details of eye-witnesses at the scene.'
    ],
    suggestedLawyerSpecialization: 'Criminal Defense & Human Rights Attorney',
    emergencyHelpline: '100 / 112 / 108 (Ambulance)'
  },
  {
    id: 'law-women-harassment',
    crimeName: 'Harassment, Eve-Teasing, Stalking & Outraging Modesty',
    keywords: ['harassment', 'eve teasing', 'stalking', 'molestation', 'cyberstalking', 'modesty', 'inappropriate touch', 'lewd remarks', 'women safety'],
    applicableAct: 'Bharatiya Nyaya Sanhita (BNS), 2023 / IPC / Information Technology Act',
    sections: {
      ipcSection: 'Section 354A (Sexual harassment), Section 354D (Stalking), Section 509 (Insulting modesty of a woman)',
      bnsSection: 'Section 75 (Sexual harassment), Section 78 (Stalking), Section 79 (Words, gestures intended to insult modesty)'
    },
    definition: 'Physical contact involving unwelcome and explicit sexual overtures, demanding sexual favors, showing pornography against will, stalking physically or digitally, or uttering words/gestures insulting a woman modesty.',
    punishment: 'Imprisonment of 1 to 3 years for first conviction; up to 5 years + fine for repeat offenders.',
    bailable: 'First conviction for stalking is Bailable; repeat offences or sexual harassment with physical force are Non-Bailable',
    cognizable: 'Cognizable (Police officer must register FIR on victim statement)',
    courtTriableBy: 'Any Magistrate / Women Fast Track Court',
    reportingProcedure: [
      'Dial Women Helpline 1090 / 1091 or 100/112 immediately.',
      'Statement must be recorded by a woman police officer under BNSS Sec 173 / CrPC Sec 154.',
      'Zero FIR can be filed at any police station regardless of jurisdictional boundaries.',
      'For cyber stalking: File report with digital proof on cybercrime.gov.in.'
    ],
    immediateCitizenAction: [
      'Take photos or record audio/video discretely if safe to do so.',
      'Do not engage alone; move towards crowded public places or security guard posts.',
      'Reach out to local Women Safety Desk.'
    ],
    suggestedLawyerSpecialization: 'Women Rights & Criminal Litigation Advocate',
    emergencyHelpline: '1090 (Women Power Line) / 1091 / 100'
  },
  {
    id: 'law-domestic-violence',
    crimeName: 'Domestic Violence & Cruelty by Relatives',
    keywords: ['domestic violence', 'dowry', 'marital cruelty', 'spouse abuse', 'wife beating', 'in-laws harassment'],
    applicableAct: 'Protection of Women from Domestic Violence Act (PWDVA), 2005 & BNS / IPC',
    sections: {
      ipcSection: 'Section 498A (Husband or relative of husband subjecting woman to cruelty)',
      bnsSection: 'Section 85 & Section 86 (Cruelty by husband or relatives of husband)'
    },
    definition: 'Any act, omission, or conduct of physical, sexual, verbal, emotional, or economic abuse against an aggrieved woman living in a shared household.',
    punishment: 'Imprisonment up to 3 years + fine under Section 85 BNS / 498A IPC. Protection orders, residence orders, and interim monetary compensation under PWDVA.',
    bailable: 'Non-Bailable',
    cognizable: 'Cognizable',
    courtTriableBy: 'Magistrate First Class / Family Court',
    reportingProcedure: [
      'Approach the local Protection Officer (PO) or Service Provider NGO under the Domestic Violence Act.',
      'Lodge a Domestic Incident Report (DIR) before the Judicial Magistrate.',
      'File an FIR at the Crime Against Women (CAW) Cell at your local police station.'
    ],
    immediateCitizenAction: [
      'Keep copies of identity cards, financial documents, medical records, and children papers safely.',
      'Reach out to national 181 Women in Distress helpline for shelter home support.'
    ],
    suggestedLawyerSpecialization: 'Family Law & Domestic Violence Legal Expert',
    emergencyHelpline: '181 (Women in Distress Helpline) / 1090 / 100'
  },
  {
    id: 'law-hit-run-traffic',
    crimeName: 'Hit and Run, Reckless & Drunk Driving',
    keywords: ['hit and run', 'accident', 'rash driving', 'drunk driving', 'over speeding', 'motor vehicle', 'road crash'],
    applicableAct: 'Bharatiya Nyaya Sanhita (BNS), 2023 & Motor Vehicles Act, 1988',
    sections: {
      ipcSection: 'Section 279 (Rash driving), Section 304A (Causing death by negligence)',
      bnsSection: 'Section 281 (Rash driving on public way), Section 106(1) & 106(2) (Hit and run causing death)',
      otherAct: 'Motor Vehicles Act Section 185 (Driving under influence of alcohol/drugs)'
    },
    definition: 'Driving a vehicle recklessly on any public way so as to endanger human life, or escaping the scene of collision without reporting to police or medical authorities.',
    punishment: 'Rash driving: Up to 6 months jail. Hit and Run causing death without reporting: Up to 10 years imprisonment + heavy fine under BNS Sec 106(2). Drunk driving: Up to 6 months jail + license suspension.',
    bailable: 'Rash driving is Bailable; Aggravated Hit-and-Run without reporting is Non-Bailable',
    cognizable: 'Cognizable',
    courtTriableBy: 'Magistrate First Class / Sessions Court',
    reportingProcedure: [
      'Call 100 / 112 immediately and report the vehicle make, model, color, and license plate digits.',
      'Summon ambulance (108) for immediate casualty stabilization.',
      'Police will conduct spot Panchnama, seize vehicle parts (broken glass/paint chips), and inspect traffic camera feeds.'
    ],
    immediateCitizenAction: [
      'Note down the escape direction and vehicle registration plate immediately.',
      'Under the Good Samaritan Law (Supreme Court ruling), citizens assisting accident victims are legally protected from police harassment or compulsory court appearances.'
    ],
    suggestedLawyerSpecialization: 'Motor Accident Claims (MACT) & Criminal Defense Counsel',
    emergencyHelpline: '100 / 112 / 108 / 1073 (Road Accident Emergency)'
  },
  {
    id: 'law-extortion-blackmail',
    crimeName: 'Extortion, Blackmail & Criminal Intimidation',
    keywords: ['extortion', 'blackmail', 'threat', 'ransom', 'protection money', 'intimidation', 'coercion', 'video blackmail'],
    applicableAct: 'Bharatiya Nyaya Sanhita (BNS), 2023 / Indian Penal Code (IPC), 1860',
    sections: {
      ipcSection: 'Section 383 (Definition of Extortion), Section 384 (Punishment), Section 506 (Criminal intimidation)',
      bnsSection: 'Section 308 (Extortion) & Section 351 (Criminal Intimidation)'
    },
    definition: 'Intentionally putting any person in fear of any injury to that person or to any other, and thereby dishonestly inducing the person to deliver money, property, or valuable security.',
    punishment: 'Imprisonment up to 3 years to 10 years (or life imprisonment if threat of death/grievous hurt is involved) + fine.',
    bailable: 'Non-Bailable (for aggravated extortion)',
    cognizable: 'Cognizable',
    courtTriableBy: 'Magistrate First Class / Court of Session',
    reportingProcedure: [
      'Do NOT pay extortion ransom or transfer funds, as demands will escalate.',
      'Record all threat phone calls and preserve audio recordings and text messages.',
      'Report directly to the Anti-Extortion Cell / Crime Branch or local police station chief.'
    ],
    immediateCitizenAction: [
      'Preserve caller ID and call recordings.',
      'Request immediate police protection if there is imminent threat to life.'
    ],
    suggestedLawyerSpecialization: 'Criminal Defense & Special Crime Litigation Counsel',
    emergencyHelpline: '100 / 112'
  },
  {
    id: 'law-pocso-child',
    crimeName: 'Child Abuse, Molestation & POCSO Violations',
    keywords: ['child', 'pocso', 'minor', 'child abuse', 'child labor', 'molestation of minor', 'school safety'],
    applicableAct: 'Protection of Children from Sexual Offences (POCSO) Act, 2012',
    sections: {
      otherAct: 'POCSO Act Section 3, 5, 7, 9 (Sexual assault, aggravated sexual assault, penetrative sexual assault)'
    },
    definition: 'Any sexual offence committed against an individual below 18 years of age. Gender-neutral legislation providing stringent mandatory reporting obligations.',
    punishment: 'Imprisonment ranging from 5 years to 20 years, up to Life Imprisonment or Death penalty for aggravated offences.',
    bailable: 'Non-Bailable',
    cognizable: 'Cognizable (Mandatory reporting: failure to report is also punishable by 1 year jail)',
    courtTriableBy: 'Special POCSO Court',
    reportingProcedure: [
      'Dial Childline 1098 or 100/112 immediately.',
      'Child statement must be recorded in presence of parents/guardians at child residence or chosen safe place without police uniform.',
      'Special POCSO Court ensures trial is completed within 1 year.'
    ],
    immediateCitizenAction: [
      'Provide medical care and psychological counselling assistance.',
      'Never disclose identity or photos of the minor victim in any public medium (punishable offence).'
    ],
    suggestedLawyerSpecialization: 'Special POCSO & Child Rights Senior Advocate',
    emergencyHelpline: '1098 (Childline 24/7) / 100 / 112'
  },
  {
    id: 'law-zero-fir',
    crimeName: 'Right to File Zero FIR & Police Refusal Remedies',
    keywords: ['zero fir', 'fir refusal', 'police not filing fir', 'jurisdiction', 'how to file fir', 'police complaint', 'complaint procedure'],
    applicableAct: 'Code of Criminal Procedure (CrPC Sec 154) / Bharatiya Nagarik Suraksha Sanhita (BNSS Sec 173)',
    sections: {
      otherAct: 'BNSS Section 173(1) & Supreme Court ruling in Lalita Kumari vs Govt of UP (Mandatory FIR registration)'
    },
    definition: 'Zero FIR allows any citizen to register an FIR at ANY police station irrespective of the place of incident. The station registers it as Number 0 and transfers it to the jurisdictional police station.',
    punishment: 'Police officers refusing to register FIR for cognizable offences face departmental suspension and prosecution under Section 166A IPC / Section 199 BNS (up to 2 years imprisonment).',
    bailable: 'N/A (Citizen Procedural Right)',
    cognizable: 'Mandatory on all Cognizable Offences',
    courtTriableBy: 'Judicial Magistrate / High Court',
    reportingProcedure: [
      'Walk into the nearest police station or use SafeCity Hub e-filing portal.',
      'If local police refuse to register FIR, submit written complaint to Superintendent of Police (SP) / Deputy Commissioner of Police (DCP) under CrPC 154(3) / BNSS 173(4).',
      'Approach Judicial Magistrate via Section 156(3) CrPC / Section 175(3) BNSS through a verified advocate to direct police to investigate.'
    ],
    immediateCitizenAction: [
      'Demand a free signed copy of the FIR on the spot.',
      'Note badge number and name of the duty officer.',
      'Consult a criminal advocate to draft a formal Magistrate Complaint if police delay.'
    ],
    suggestedLawyerSpecialization: 'Criminal Procedure & Constitutional Rights Advocate',
    emergencyHelpline: '100 / 112 / Police Vigilance Helpline'
  }
];
