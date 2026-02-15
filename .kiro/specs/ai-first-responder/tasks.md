# Implementation Plan: AI First Responder System

## Overview

This implementation plan breaks down the AI First Responder system into incremental coding tasks. The system will be built using TypeScript/Node.js with a focus on safety-first architecture, starting with core crisis handling components, then adding multilingual support, privacy features, and institutional integration.

The implementation follows a layered approach:
1. Core data models and interfaces
2. Crisis classification and safety guidance (with rule-based overrides)
3. Routing engine and institutional resource management
4. Conversation management and context preservation
5. Privacy, encryption, and audit logging
6. API layer and access control
7. Integration and end-to-end wiring

## Tasks

- [ ] 1. Set up project structure and core data models
  - Create TypeScript project with necessary dependencies (Express, fast-check for testing)
  - Define core TypeScript interfaces and types from design (Message, Session, CrisisEvent, etc.)
  - Set up testing framework (Jest) with fast-check for property-based testing
  - Create database schema for sessions, audit logs, and institutional resources
  - _Requirements: All requirements (foundational)_

- [ ] 2. Implement Crisis Classifier and Severity Assessor
  - [ ] 2.1 Create Crisis Classifier with LLM integration
    - Implement CrisisClassifier interface with crisis type identification
    - Integrate with LLM service for crisis extraction
    - Handle multiple crisis types in single description
    - _Requirements: 2.1, 2.3_
  
  - [ ]* 2.2 Write property test for crisis classification
    - **Property 3: Crisis Type Classification Validity**
    - **Validates: Requirements 2.1**
  
  - [ ]* 2.3 Write property test for multiple crisis detection
    - **Property 5: Multiple Crisis Type Detection**
    - **Validates: Requirements 2.3**
  
  - [ ] 2.4 Implement Severity Assessor
    - Create SeverityAssessor that assigns levels 1-4
    - Implement critical rule: self-harm and immediate danger always get severity 4
    - _Requirements: 2.2, 2.4_
  
  - [ ]* 2.5 Write property test for severity level range
    - **Property 4: Severity Level Range Constraint**
    - **Validates: Requirements 2.2**
  
  - [ ]* 2.6 Write property test for critical severity assignment
    - **Property 6: Critical Severity Assignment for Self-Harm and Immediate Danger**
    - **Validates: Requirements 2.4**

- [ ] 3. Implement Safety Guidance Engine with rule-based overrides
  - [ ] 3.1 Create Safety Guidance Engine
    - Implement SafetyGuidanceEngine interface
    - Create rule-based guidance templates for each crisis type
    - Implement emergency contact inclusion for severity 4
    - Implement helpline provision for self-harm cases
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ]* 3.2 Write property test for safety guidance provision
    - **Property 7: Safety Guidance Provision**
    - **Validates: Requirements 3.1**
  
  - [ ]* 3.3 Write property test for emergency contact inclusion
    - **Property 8: Emergency Contact Inclusion for Critical Cases**
    - **Validates: Requirements 3.2**
  
  - [ ]* 3.4 Write property test for self-harm helpline provision
    - **Property 9: Self-Harm Helpline Provision**
    - **Validates: Requirements 3.3**

- [ ] 4. Implement Safety Guardrail Validator
  - [ ] 4.1 Create Safety Guardrail Validator
    - Implement validation rules for LLM responses
    - Create pre-approved override responses for high-risk scenarios
    - Implement rule-based override logic for severity 4 and self-harm
    - Implement low-confidence human escalation
    - _Requirements: 7.1, 7.2, 7.3, 7.5_
  
  - [ ]* 4.2 Write property test for safety rule override
    - **Property 20: Safety Rule Override for High-Risk Scenarios**
    - **Validates: Requirements 7.1**
  
  - [ ]* 4.3 Write property test for response validation gate
    - **Property 21: Response Validation Gate**
    - **Validates: Requirements 7.2**
  
  - [ ]* 4.4 Write property test for safety violation replacement
    - **Property 22: Safety Violation Response Replacement**
    - **Validates: Requirements 7.3**
  
  - [ ]* 4.5 Write property test for low confidence escalation
    - **Property 23: Low Confidence Human Escalation**
    - **Validates: Requirements 7.5**

- [ ] 5. Checkpoint - Ensure core crisis handling works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement Routing Engine and Institutional Resource Management
  - [ ] 6.1 Create Institutional Resource Database interface
    - Implement InstitutionalResourceDB for storing institution configs
    - Create validation for required resources (ICC, Anti_Ragging_Cell, Counselor)
    - Support multi-institution configurations
    - _Requirements: 14.1, 14.3, 14.5_
  
  - [ ]* 6.2 Write property test for institutional configuration validation
    - **Property 36: Institutional Configuration Validation**
    - **Validates: Requirements 14.5**
  
  - [ ] 6.3 Implement Routing Engine
    - Create RoutingEngine that maps crisis types to resources
    - Implement crisis-type-based routing (harassment→ICC, ragging→Anti_Ragging_Cell, mental_health→Counselor)
    - Implement police routing for severity 4 physical threats
    - Implement alternative resource provision (NGOs when institutional unavailable)
    - Provide multiple resource options
    - Use institution-specific contacts
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 14.2_
  
  - [ ]* 6.4 Write property test for crisis-type-based routing
    - **Property 10: Crisis-Type-Based Routing**
    - **Validates: Requirements 4.1, 4.2, 4.3**
  
  - [ ]* 6.5 Write property test for police routing
    - **Property 11: Police Routing for Critical Physical Danger**
    - **Validates: Requirements 4.4**
  
  - [ ]* 6.6 Write property test for alternative resources
    - **Property 12: Alternative Resource Provision**
    - **Validates: Requirements 4.5**
  
  - [ ]* 6.7 Write property test for multiple resource options
    - **Property 13: Multiple Resource Options**
    - **Validates: Requirements 4.6**
  
  - [ ]* 6.8 Write property test for institution-specific routing
    - **Property 35: Institution-Specific Resource Routing**
    - **Validates: Requirements 14.2**

- [ ] 7. Implement Language Detection and Multilingual Support
  - [ ] 7.1 Create Language Detector
    - Implement LanguageDetector for English and Hindi
    - Handle language detection with confidence scoring
    - _Requirements: 1.1, 1.2_
  
  - [ ]* 7.2 Write property test for language detection and response matching
    - **Property 1: Language Detection and Response Matching**
    - **Validates: Requirements 1.1**
  
  - [ ] 7.3 Implement language switching in Conversation Manager
    - Support mid-conversation language switching
    - Preserve context across language changes
    - _Requirements: 1.3, 1.5_
  
  - [ ]* 7.4 Write property test for language switch with context preservation
    - **Property 2: Language Switch Adaptation with Context Preservation**
    - **Validates: Requirements 1.3, 1.5, 13.4**

- [ ] 8. Implement Context Store and conversation context management
  - [ ] 8.1 Create Context Store
    - Implement ContextStore interface with database persistence
    - Implement context retrieval and saving
    - Implement 90-day automatic deletion
    - Implement manual deletion on request
    - _Requirements: 13.1, 11.1, 11.2_
  
  - [ ]* 8.2 Write property test for session context continuity
    - **Property 31: Session Context Continuity**
    - **Validates: Requirements 13.1**
  
  - [ ]* 8.3 Write property test for crisis classification persistence
    - **Property 32: Crisis Classification Persistence**
    - **Validates: Requirements 13.2**
  
  - [ ]* 8.4 Write property test for conversation data expiration
    - **Property 24: Conversation Data Expiration**
    - **Validates: Requirements 11.1**
  
  - [ ] 8.5 Implement session resumption logic
    - Support resuming conversations within 24 hours
    - Implement context summarization for long conversations
    - _Requirements: 13.3, 13.5_
  
  - [ ]* 8.6 Write property test for session resumption
    - **Property 33: Session Resumption Within 24 Hours**
    - **Validates: Requirements 13.3**
  
  - [ ]* 8.7 Write property test for context summarization
    - **Property 34: Context Summarization Preserves Crisis Details**
    - **Validates: Requirements 13.5**

- [ ] 9. Implement Privacy, Encryption, and Data Management
  - [ ] 9.1 Create encryption service
    - Implement encryption for PII and audit logs
    - Use industry-standard encryption (AES-256)
    - _Requirements: 5.3, 6.2_
  
  - [ ]* 9.2 Write property test for PII encryption
    - **Property 15: PII Encryption**
    - **Validates: Requirements 5.3**
  
  - [ ] 9.3 Implement anonymous session handling
    - Default to anonymous mode (no PII collection)
    - Implement PII exclusion for anonymous sessions
    - _Requirements: 5.1, 5.2_
  
  - [ ]* 9.4 Write property test for anonymous session PII exclusion
    - **Property 14: Anonymous Session PII Exclusion**
    - **Validates: Requirements 5.2**
  
  - [ ] 9.5 Implement data deletion functionality
    - Implement deletion request handling
    - Ensure audit logs are preserved when conversation data is deleted
    - Return deletion confirmation
    - _Requirements: 11.2, 11.3, 11.5_
  
  - [ ]* 9.6 Write property test for data deletion fulfillment
    - **Property 25: Data Deletion Request Fulfillment**
    - **Validates: Requirements 11.2**
  
  - [ ]* 9.7 Write property test for audit log separation
    - **Property 26: Audit Log Separation from Conversation Data**
    - **Validates: Requirements 11.3**
  
  - [ ]* 9.8 Write property test for deletion confirmation
    - **Property 27: Data Deletion Confirmation**
    - **Validates: Requirements 11.5**

- [ ] 10. Checkpoint - Ensure privacy and data management works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement Audit Logger
  - [ ] 11.1 Create Audit Logger
    - Implement AuditLogger interface with encrypted storage
    - Log crisis interactions with required fields (timestamp, crisis type, severity, routing)
    - Log administrator access events
    - Exclude PII from audit logs unless explicitly provided
    - Implement 2-year retention
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 11.2 Write property test for crisis interaction logging
    - **Property 16: Crisis Interaction Audit Logging**
    - **Validates: Requirements 6.1**
  
  - [ ]* 11.3 Write property test for audit log encryption
    - **Property 17: Audit Log Encryption**
    - **Validates: Requirements 6.2**
  
  - [ ]* 11.4 Write property test for audit log PII exclusion
    - **Property 18: Audit Log PII Exclusion**
    - **Validates: Requirements 6.3**
  
  - [ ]* 11.5 Write property test for administrator access logging
    - **Property 19: Administrator Access Logging**
    - **Validates: Requirements 6.4**

- [ ] 12. Implement Conversation Manager
  - [ ] 12.1 Create Conversation Manager orchestration
    - Implement ConversationManager that coordinates all components
    - Orchestrate flow: Language Detection → LLM → Safety Validation → Classification → Severity → Guidance → Routing
    - Manage session state and context updates
    - Handle error scenarios with graceful degradation
    - _Requirements: All requirements (orchestration)_
  
  - [ ]* 12.2 Write integration tests for conversation flow
    - Test end-to-end crisis handling flow
    - Test error handling and fallback scenarios
    - _Requirements: All requirements_

- [ ] 13. Implement LLM Service integration
  - [ ] 13.1 Create LLM Service wrapper
    - Implement LLMService interface with OpenAI/Anthropic integration
    - Implement response generation with context
    - Implement crisis information extraction
    - Handle timeouts and errors with fallback to rule-based responses
    - _Requirements: 2.1, 3.1, 7.1_
  
  - [ ]* 13.2 Write unit tests for LLM service error handling
    - Test timeout handling
    - Test fallback to rule-based responses
    - _Requirements: 7.1_

- [ ] 14. Implement Role-Based Access Control
  - [ ] 14.1 Create authentication and authorization middleware
    - Implement role definitions (Student, Counselor, Administrator, Auditor)
    - Implement role-based access control checks
    - Implement counselor access restriction to counseling cases only
    - Implement auditor read-only access
    - Implement default-deny for unauthorized access
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ]* 14.2 Write property test for counselor access restriction
    - **Property 28: Counselor Access Restriction**
    - **Validates: Requirements 12.2**
  
  - [ ]* 14.3 Write property test for auditor read-only access
    - **Property 29: Auditor Read-Only Access**
    - **Validates: Requirements 12.4**
  
  - [ ]* 14.4 Write property test for default-deny access control
    - **Property 30: Default-Deny Access Control**
    - **Validates: Requirements 12.5**

- [ ] 15. Implement API Gateway and REST endpoints
  - [ ] 15.1 Create API Gateway with Express
    - Implement POST /api/v1/message endpoint
    - Implement GET /api/v1/session/:sessionId endpoint
    - Implement DELETE /api/v1/session/:sessionId endpoint
    - Implement GET /api/v1/health endpoint
    - Add rate limiting and request validation
    - Add authentication middleware
    - _Requirements: All requirements (API layer)_
  
  - [ ]* 15.2 Write integration tests for API endpoints
    - Test all endpoints with valid and invalid inputs
    - Test authentication and authorization
    - Test rate limiting
    - _Requirements: All requirements_

- [ ] 16. Implement Feedback and Follow-up System
  - [ ] 16.1 Create feedback collection
    - Implement feedback survey offering at conversation conclusion
    - Store feedback anonymously
    - Collect helpfulness, clarity, and appropriateness ratings
    - _Requirements: 15.1, 15.2, 15.3_
  
  - [ ]* 16.2 Write property test for feedback survey offering
    - **Property 37: Feedback Survey Offering**
    - **Validates: Requirements 15.1**
  
  - [ ]* 16.3 Write property test for anonymous feedback storage
    - **Property 38: Anonymous Feedback Storage**
    - **Validates: Requirements 15.3**
  
  - [ ] 16.4 Implement follow-up check-in system
    - Implement opt-in for follow-up check-ins
    - Schedule check-ins at 24 hours and 7 days
    - _Requirements: 15.4, 15.5_
  
  - [ ]* 16.5 Write property test for follow-up scheduling
    - **Property 39: Follow-Up Message Scheduling**
    - **Validates: Requirements 15.5**

- [ ] 17. Checkpoint - Ensure all components integrated
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. Implement Student Interface (Web UI)
  - [ ] 18.1 Create React-based student interface
    - Implement chat interface with message sending and receiving
    - Implement language selection and switching
    - Display safety guidance and resource recommendations
    - Implement data deletion request UI
    - Ensure accessibility (keyboard navigation, screen reader support, color contrast)
    - _Requirements: 1.1, 1.3, 5.5, 10.2, 10.3, 10.4_
  
  - [ ]* 18.2 Write accessibility tests
    - Test keyboard navigation
    - Test color contrast ratios
    - _Requirements: 10.3, 10.4_

- [ ] 19. Implement error handling and monitoring
  - [ ] 19.1 Add comprehensive error handling
    - Implement error categories (input validation, auth, external service, classification, data)
    - Implement graceful degradation for external service failures
    - Implement circuit breakers for LLM service
    - Display emergency contacts on error pages
    - _Requirements: 9.5_
  
  - [ ]* 19.2 Write unit tests for error scenarios
    - Test all error categories
    - Test fallback behaviors
    - Test circuit breaker functionality
    - _Requirements: All requirements (error handling)_

- [ ] 20. Final integration and end-to-end testing
  - [ ] 20.1 Wire all components together
    - Ensure API Gateway → Conversation Manager → all components flow works
    - Ensure database connections and encryption work end-to-end
    - Ensure audit logging captures all required events
    - _Requirements: All requirements_
  
  - [ ]* 20.2 Write end-to-end integration tests
    - Test complete crisis scenarios from student message to resource routing
    - Test multilingual scenarios
    - Test privacy and anonymity scenarios
    - Test role-based access scenarios
    - _Requirements: All requirements_

- [ ] 21. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties (39 total)
- Unit tests validate specific examples, edge cases, and error conditions
- The implementation prioritizes safety-critical components first (classification, guidance, validation)
- All PII handling includes encryption and privacy protections
- Rule-based overrides ensure safety even if AI components fail
