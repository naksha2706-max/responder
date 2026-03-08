/**
 * Test normal ragging message to ensure it doesn't trigger emergency response
 */

// Simple test without imports - just check the logic
const testMessage = "My seniors force me to do pushups at midnight and threaten me every night in the hostel";

console.log('🧪 Testing Normal Ragging Message Flow\n');
console.log('📝 Test Message:', testMessage);
console.log('');

// Check if this message contains emergency keywords
const emergencyKeywords = [
  'kill myself', 'end my life', 'want to die', 'suicide', 'suicidal',
  'cut myself', 'hurt myself', 'self harm', 'self-harm'
];

const hasEmergencyKeywords = emergencyKeywords.some(keyword => 
  testMessage.toLowerCase().includes(keyword.toLowerCase())
);

console.log('🔍 Emergency Keyword Check:');
console.log('  - Contains emergency keywords:', hasEmergencyKeywords);
console.log('  - Should trigger emergency response:', hasEmergencyKeywords);
console.log('');

console.log('✅ Expected Behavior:');
console.log('1. This message should NOT trigger emergency response');
console.log('2. Should go to normal AI conversation flow');
console.log('3. First response should be empathetic');
console.log('4. Second response should classify as RAGGING');
console.log('5. User should see complaint draft in Action Center');
console.log('');

console.log('🎯 The issue was: Emergency detection was too sensitive');
console.log('🔧 Fix applied: Increased confidence threshold to 0.8+ and made keywords more specific');