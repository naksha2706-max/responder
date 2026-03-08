/**
 * Hardcoded institutional resources for MVP
 * In production, this would come from DynamoDB institutional resources table
 */

const RESOURCES = {
  // Internal Complaints Committee (for harassment cases)
  icc: {
    en: {
      type: 'icc',
      name: 'Internal Complaints Committee (ICC)',
      description: 'Handles sexual harassment and POSH-related complaints',
      phone: '1800-XXX-XXXX',
      email: 'icc@college.edu.in',
      availability: 'Monday-Friday, 9:00 AM - 5:00 PM',
      address: 'Admin Block, Room 201',
      isEmergency: false
    },
    hi: {
      type: 'icc',
      name: 'आंतरिक शिकायत समिति (ICC)',
      description: 'यौन उत्पीड़न और POSH संबंधित शिकायतों को संभालती है',
      phone: '1800-XXX-XXXX',
      email: 'icc@college.edu.in',
      availability: 'सोमवार-शुक्रवार, सुबह 9:00 - शाम 5:00',
      address: 'प्रशासन ब्लॉक, कमरा 201',
      isEmergency: false
    }
  },

  // Anti-Ragging Cell
  anti_ragging_cell: {
    en: {
      type: 'anti_ragging_cell',
      name: 'Anti-Ragging Cell',
      description: 'Dedicated team to prevent and address ragging incidents',
      phone: '1800-180-5522',
      email: 'antiragging@college.edu.in',
      availability: '24/7 Helpline',
      address: 'Student Welfare Office',
      isEmergency: true
    },
    hi: {
      type: 'anti_ragging_cell',
      name: 'एंटी-रैगिंग सेल',
      description: 'रैगिंग की घटनाओं को रोकने और संबोधित करने के लिए समर्पित टीम',
      phone: '1800-180-5522',
      email: 'antiragging@college.edu.in',
      availability: '24/7 हेल्पलाइन',
      address: 'छात्र कल्याण कार्यालय',
      isEmergency: true
    }
  },

  // College Counselor
  counselor: {
    en: {
      type: 'counselor',
      name: 'College Counseling Services',
      description: 'Professional mental health support and counseling',
      phone: '1800-XXX-YYYY',
      email: 'counselor@college.edu.in',
      availability: 'Monday-Friday, 10:00 AM - 4:00 PM',
      address: 'Student Health Center, 2nd Floor',
      isEmergency: false
    },
    hi: {
      type: 'counselor',
      name: 'कॉलेज काउंसलिंग सेवाएं',
      description: 'पेशेवर मानसिक स्वास्थ्य सहायता और परामर्श',
      phone: '1800-XXX-YYYY',
      email: 'counselor@college.edu.in',
      availability: 'सोमवार-शुक्रवार, सुबह 10:00 - शाम 4:00',
      address: 'छात्र स्वास्थ्य केंद्र, दूसरी मंजिल',
      isEmergency: false
    }
  },

  // Police Emergency
  police: {
    en: {
      type: 'police',
      name: 'Police Emergency Services',
      description: 'Immediate police assistance for emergencies',
      phone: '112',
      email: null,
      availability: '24/7 Emergency Hotline',
      address: 'Dial 112 from any phone',
      isEmergency: true
    },
    hi: {
      type: 'police',
      name: 'पुलिस आपातकालीन सेवाएं',
      description: 'आपात स्थिति के लिए तत्काल पुलिस सहायता',
      phone: '112',
      email: null,
      availability: '24/7 आपातकालीन हॉटलाइन',
      address: 'किसी भी फोन से 112 डायल करें',
      isEmergency: true
    }
  },

  // Crisis Helpline
  helpline: {
    en: {
      type: 'helpline',
      name: 'National Suicide Prevention Helpline',
      description: 'Confidential crisis support and suicide prevention',
      phone: '9152987821',
      email: null,
      availability: '24/7 Crisis Helpline',
      address: 'Call anytime for immediate support',
      isEmergency: true
    },
    hi: {
      type: 'helpline',
      name: 'राष्ट्रीय आत्महत्या रोकथाम हेल्पलाइन',
      description: 'गोपनीय संकट सहायता और आत्महत्या रोकथाम',
      phone: '9152987821',
      email: null,
      availability: '24/7 संकट हेल्पलाइन',
      address: 'तत्काल सहायता के लिए कभी भी कॉल करें',
      isEmergency: true
    }
  },

  // Women's Helpline
  womens_helpline: {
    en: {
      type: 'helpline',
      name: 'Women\'s Helpline',
      description: 'Support for women facing violence or harassment',
      phone: '1091',
      email: null,
      availability: '24/7 Helpline',
      address: 'Nationwide helpline for women',
      isEmergency: true
    },
    hi: {
      type: 'helpline',
      name: 'महिला हेल्पलाइन',
      description: 'हिंसा या उत्पीड़न का सामना करने वाली महिलाओं के लिए सहायता',
      phone: '1091',
      email: null,
      availability: '24/7 हेल्पलाइन',
      address: 'महिलाओं के लिए राष्ट्रव्यापी हेल्पलाइन',
      isEmergency: true
    }
  },

  // Cyber Crime Cell
  cyber_cell: {
    en: {
      type: 'police',
      name: 'Cyber Crime Helpline',
      description: 'Report cyberbullying and online harassment',
      phone: '1930',
      email: 'complaints@cybercrime.gov.in',
      availability: '24/7 Helpline',
      address: 'National Cyber Crime Reporting Portal',
      isEmergency: false
    },
    hi: {
      type: 'police',
      name: 'साइबर क्राइम हेल्पलाइन',
      description: 'साइबरबुलिंग और ऑनलाइन उत्पीड़न की रिपोर्ट करें',
      phone: '1930',
      email: 'complaints@cybercrime.gov.in',
      availability: '24/7 हेल्पलाइन',
      address: 'राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल',
      isEmergency: false
    }
  }
};

/**
 * Get resources based on crisis type and severity
 */
function getResourcesForCrisis(crisisType, severityLevel, language = 'en') {
  const resources = [];

  // Severity 4: Always include emergency contacts first
  if (severityLevel === 4) {
    if (crisisType === 'self_harm') {
      resources.push(RESOURCES.helpline[language]);
      resources.push(RESOURCES.counselor[language]);
    } else if (crisisType === 'physical_threat') {
      resources.push(RESOURCES.police[language]);
      resources.push(RESOURCES.anti_ragging_cell[language]);
    } else {
      resources.push(RESOURCES.police[language]);
    }
  }

  // Crisis-specific resources
  switch (crisisType) {
    case 'harassment':
      resources.push(RESOURCES.icc[language]);
      resources.push(RESOURCES.womens_helpline[language]);
      resources.push(RESOURCES.counselor[language]);
      break;

    case 'ragging':
      resources.push(RESOURCES.anti_ragging_cell[language]);
      resources.push(RESOURCES.counselor[language]);
      if (severityLevel >= 3) {
        resources.push(RESOURCES.police[language]);
      }
      break;

    case 'cyberbullying':
      resources.push(RESOURCES.cyber_cell[language]);
      resources.push(RESOURCES.counselor[language]);
      break;

    case 'mental_health':
      resources.push(RESOURCES.counselor[language]);
      if (severityLevel >= 3) {
        resources.push(RESOURCES.helpline[language]);
      }
      break;

    case 'self_harm':
      if (severityLevel < 4) {
        resources.push(RESOURCES.helpline[language]);
      }
      resources.push(RESOURCES.counselor[language]);
      break;

    case 'physical_threat':
      if (severityLevel < 4) {
        resources.push(RESOURCES.police[language]);
      }
      resources.push(RESOURCES.anti_ragging_cell[language]);
      resources.push(RESOURCES.counselor[language]);
      break;

    default:
      resources.push(RESOURCES.counselor[language]);
  }

  // Remove duplicates while preserving order
  const uniqueResources = [];
  const seen = new Set();
  
  for (const resource of resources) {
    const key = `${resource.type}-${resource.name}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueResources.push(resource);
    }
  }

  return uniqueResources;
}

/**
 * Get all available resources (for admin/testing)
 */
function getAllResources(language = 'en') {
  return Object.values(RESOURCES).map(resource => resource[language]);
}

module.exports = {
  RESOURCES,
  getResourcesForCrisis,
  getAllResources
};
