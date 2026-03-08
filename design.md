# Sahayak AI - System Design

## Architecture Overview
The Sahayak AI platform follows a "Safety-First" pipeline that ensures critical student needs are met before any complex AI processing occurs.

### 1. The Safety Pipeline
1. **User Input**: Captured via a multilingual chat interface.
2. **Pre-screening Layer**: A high-speed scanning service that checks for 4 emergency categories across 7 languages.
3. **Emergency Bypass**: If confidence > 0.6, the system immediately serves a pre-validated crisis response and emergency contacts, bypassing the AI.
4. **AI Processing**: If non-emergency, the input is sent to Amazon Bedrock (Claude 3 Haiku) with a trauma-informed system prompt.
5. **Validation & Output**: The AI response is validated for safety rules before being displayed to the student.

## Core Design Components

### AI Engine (Amazon Bedrock)
- **Model**: Claude 3 Haiku (chosen for speed and specific instruction-following).
- **System Prompt**: Encapsulates the trauma-informed persona and legal expertise.
- **Structured Output**: AI generates JSON to allow the frontend to separate emotional support from action steps.

### Data Layer (DynamoDB)
- **Session Tracking**: Maintains context over multiple interactions.
- **Message History**: Securely stores conversation logs for continuity (with PII protection).
- **Institution Data**: Maps crisis types to specific college authorities and local laws.

### Frontend (React & Next.js)
- **Consistent UI**: Unified Blue/Purple theme using CSS variables for scalability.
- **Interactive Action Center**: Provides distinct modules for "Second Opinions," "Legal Rights," and "Time-Locked Evidence."
- **Responsive Layout**: Optimized for student use on both mobile and desktop.

## Security & Privacy
- **Scrubbed Logs**: System avoids storing sensitive PII in plain text.
- **Credential Management**: AWS secrets are managed via environment variables (no hardcoded keys).
- **Safe Fallbacks**: Guaranteed response even during infrastructure timeouts (8-second threshold).
