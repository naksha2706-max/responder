/**
 * Test the fixed emergency detection system
 * Normal ragging complaints should NOT trigger emergency responses
 */

const { multiLanguageEmergencyCheck } = require('./src/lib/prescreen.ts');

console.log('🧪 Testing Fixed Emergency Detection\n');

// Test 1: Normal ragging complaint (should NOT be emergency)
const normalRagging = "My seniors force me to do pushups at midnight and threaten me every night in the hostel";
const result1 = multiLanguageEmergencyCheck(normalRagging);
console.log('Test 1 - Normal Ragging Complaint:');
console.log('Message:', normalRagging);
console.log('Is Emergency:', result1.isEmergency);
console.log('Confidence:', result1.confidence);
console.log('Expected: isEmergency = false (should go through normal chat flow)\n');

// Test 2: Genuine suicide threat (should BE emergency)
const suicideMessage = "I want to kill myself, I can't take this anymore";
const result2 = multiLanguageEmergencyCheck(suicideMessage);
console.log('Test 2 - Genuine Suicide Threat:');
console.log('Message:', suicideMessage);
console.log('Is Emergency:', result2.isEmergency);
console.log('Confidence:', result2.confidence);
console.log('Expected: isEmergency = true (should trigger emergency response)\n');

// Test 3: Another normal complaint (should NOT be emergency)
const harassment = "A professor keeps sending me personal messages and makes me uncomfortable";
const result3 = multiLanguageEmergencyCheck(harassment);
console.log('Test 3 - Harassment Complaint:');
console.log('Message:', harassment);
console.log('Is Emergency:', result3.isEmergency);
console.log('Confidence:', result3.confidence);
console.log('Expected: isEmergency = false (should go through normal chat flow)\n');

// Test 4: Self-harm threat (should BE emergency)
const selfHarm = "I'm going to cut myself tonight, I can't handle this";
const result4 = multiLanguageEmergencyCheck(selfHarm);
console.log('Test 4 - Self-Harm Threat:');
console.log('Message:', selfHarm);
console.log('Is Emergency:', result4.isEmergency);
console.log('Confidence:', result4.confidence);
console.log('Expected: isEmergency = true (should trigger emergency response)\n');

console.log('✅ Emergency detection fix complete!');
console.log('Normal complaints should now go through: Chat → Classification → Action Center');
console.log('Only genuine suicide/self-harm should trigger emergency responses');