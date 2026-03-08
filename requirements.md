# Sahayak AI - Project Requirements

## Project Goal
To provide a trauma-informed, multilingual crisis support and legal aid platform specifically designed for Indian college students facing crisis situations such as ragging, harassment, and mental health struggles.

## Core Requirements

### 1. Safety & Crisis Detection
- **Immediate Emergency Detection**: Must detect keywords for suicide, self-harm, and physical danger in sub-50ms.
- **Safety Overrides**: Critical situations must bypass AI conversation and provide immediate emergency guidance and contacts.
- **Trauma-Informed Support**: All AI responses must adhere to 6 strict safety rules to avoid re-traumatization.

### 2. Multilingual Support
- **7 Indian Languages**: Support for English, Hindi, Tamil, Telugu, Bengali, Kannada, and Marathi.
- **Cross-Language Detection**: Ability to detect emergencies regardless of the input language.
- **Localized Responses**: Provide crisis support and legal guidance in the user's native or preferred language.

### 3. Legal and Regulatory Framework
- **Indian Law Integration**: Must reference and provide guidance based on UGC regulations, the POSH Act, IT Act, and the Indian Penal Code (IPC).
- **Crisis Categorization**: Automatic routing for RAGGING, HARASSMENT, CYBERBULLYING, MENTAL_HEALTH, and PHYSICAL_THREAT.

### 4. Technical Reliability
- **AWS Integration**: Use Amazon Bedrock (Claude 3 Haiku) for intelligent processing and DynamoDB for secure session persistence.
- **Graceful Fallbacks**: System must provide safe, pre-defined responses if AI services or database connections time out.

### 5. UI/UX
- **Unified Brand Identity**: A consistent, professional Blue/Purple theme to foster trust and calmness.
- **Accessibility**: Mobile-responsive design with clear, energetic, and engaging user interactions.
