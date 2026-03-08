/**
 * Test the /api/classify endpoint with the specific message
 */

async function testClassifyEndpoint() {
  console.log('🧪 Testing /api/classify endpoint...\n');
  
  const testPayload = {
    message: "My seniors force me to do pushups at midnight",
    history: [],
    sessionId: "test-ragging-case",
    language: "en"
  };
  
  console.log('📤 Sending request:');
  console.log(JSON.stringify(testPayload, null, 2));
  console.log('');
  
  try {
    const response = await fetch('http://localhost:3000/api/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log(`📊 Response Status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('📥 Response Data:');
    console.log(JSON.stringify(data, null, 2));
    
    // Validate required fields
    const requiredFields = [
      'response',
      'readyToClassify', 
      'safetyOverride',
      'immediateRisk',
      'emotionScore',
      'emotionTrend',
      'classification'
    ];
    
    console.log('\n✅ Field Validation:');
    let allFieldsPresent = true;
    
    requiredFields.forEach(field => {
      const present = data.hasOwnProperty(field);
      console.log(`   ${present ? '✅' : '❌'} ${field}: ${present ? 'Present' : 'Missing'}`);
      if (!present) allFieldsPresent = false;
    });
    
    // Check classification sub-fields
    if (data.classification) {
      const classificationFields = [
        'crisisType',
        'severity', 
        'applicableLaw',
        'authority',
        'contact',
        'complaintDraft',
        'immediateGuidance',
        'legalRight'
      ];
      
      console.log('\n✅ Classification Fields:');
      classificationFields.forEach(field => {
        const present = data.classification.hasOwnProperty(field);
        console.log(`   ${present ? '✅' : '❌'} classification.${field}: ${present ? 'Present' : 'Missing'}`);
        if (!present) allFieldsPresent = false;
      });
    }
    
    console.log(`\n🎯 Overall Result: ${allFieldsPresent ? '✅ PASS' : '❌ FAIL'}`);
    
    if (allFieldsPresent) {
      console.log('\n🚀 API endpoint is working correctly!');
      console.log('✅ Ready to proceed to next step');
    } else {
      console.log('\n❌ API endpoint needs fixes before proceeding');
    }
    
    return allFieldsPresent;
    
  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    return false;
  }
}

testClassifyEndpoint();