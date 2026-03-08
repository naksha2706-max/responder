import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import WelcomeScreen from './components/WelcomeScreen';
import SafeWordSetup from './components/SafeWordSetup';
import ChatInterface from './components/ChatInterface';
import ActionCenter from './components/ActionCenter';
import WellnessVault from './components/WellnessVault';
import EmergencyPage from './components/EmergencyPage';
import AdminLogin from './components/AdminLogin';
import HeatmapDashboard from './components/HeatmapDashboard';
import CaseManagement from './components/CaseManagement';
import ProgressUpdate from './components/ProgressUpdate';

function App() {
  const [language, setLanguage] = useState('en');
  const [selectedState] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [safeWord, setSafeWord] = useState('');
  const [caseData, setCaseData] = useState(null);

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Student Portal Routes - 7 Page Streamlined Design */}
          <Route path="/" element={
            <WelcomeScreen
              language={language}
              onLanguageChange={setLanguage}
            />
          } />
          <Route path="/safe-word-setup" element={
            <SafeWordSetup
              language={language}
              onComplete={setSafeWord}
            />
          } />
          <Route path="/chat" element={
            <ChatInterface
              language={language}
              onLanguageChange={setLanguage}
              state={selectedState}
              safeWord={safeWord}
              sessionId={sessionId}
              setSessionId={setSessionId}
              setCaseData={setCaseData}
            />
          } />
          <Route path="/action-center" element={
            <ActionCenter
              language={language}
              state={selectedState}
              caseData={caseData}
            />
          } />
          <Route path="/wellness-vault" element={
            <WellnessVault
              language={language}
              sessionId={sessionId}
            />
          } />
          <Route path="/progress-update" element={
            <ProgressUpdate
              language={language}
            />
          } />
          <Route path="/emergency" element={
            <EmergencyPage
              language={language}
              state={selectedState}
            />
          } />

          {/* Admin Portal Routes */}
          <Route path="/admin" element={<AdminLogin language={language} />} />
          <Route path="/admin/analytics" element={<HeatmapDashboard language={language} />} />
          <Route path="/admin/cases" element={<CaseManagement language={language} />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
