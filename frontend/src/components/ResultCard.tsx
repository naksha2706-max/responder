import React from 'react';
import './ResultCard.css';

interface ResultCardProps {
  crisisType: string;
  severity: string;
  immediateRisk: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ crisisType, severity, immediateRisk }) => {
  return (
    <div className="result-card">
      <div className="result-row">
        <span className="result-label">Crisis Type:</span>
        <span className="result-value crisis-type">{crisisType}</span>
      </div>
      <div className="result-row">
        <span className="result-label">Severity:</span>
        <span className="result-value severity">{severity}</span>
      </div>
      <div className="result-row">
        <span className="result-label">Immediate Risk:</span>
        <span className="result-value risk">{immediateRisk}</span>
      </div>
    </div>
  );
};

export default ResultCard;
