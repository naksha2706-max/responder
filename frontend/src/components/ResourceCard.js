import React from 'react';
import './ResourceCard.css';

function ResourceCard({ resource, language }) {
  const getResourceIcon = (type) => {
    const icons = {
      icc: '⚖️',
      anti_ragging_cell: '🛡️',
      counselor: '💚',
      police: '🚨',
      helpline: '📞',
      ngo: '🤝'
    };
    return icons[type] || '📋';
  };

  const getResourceTypeLabel = (type) => {
    const labels = {
      en: {
        icc: 'ICC',
        anti_ragging_cell: 'Anti-Ragging Cell',
        counselor: 'Counselor',
        police: 'Police',
        helpline: 'Helpline',
        ngo: 'NGO'
      },
      hi: {
        icc: 'आईसीसी',
        anti_ragging_cell: 'एंटी-रैगिंग सेल',
        counselor: 'परामर्शदाता',
        police: 'पुलिस',
        helpline: 'हेल्पलाइन',
        ngo: 'एनजीओ'
      }
    };
    return labels[language][type] || type;
  };

  const is24x7 = resource.available === '24x7' || resource.available24x7;
  const isEmergency = resource.type === 'police' || resource.type === 'helpline';

  return (
    <div className="resource-card">
      {isEmergency && (
        <div className="emergency-badge">
          {language === 'en' ? 'Emergency' : 'आपातकाल'}
        </div>
      )}
      
      <div className="resource-header">
        <div className={`resource-icon ${resource.type}`}>
          {getResourceIcon(resource.type)}
        </div>
        <div className="resource-info">
          <div className="resource-type">
            {getResourceTypeLabel(resource.type)}
          </div>
          <h4 className="resource-name">{resource.name}</h4>
        </div>
      </div>

      {resource.description && (
        <p className="resource-description">{resource.description}</p>
      )}

      <div className="resource-details">
        {resource.phone && (
          <div className="resource-detail">
            <div className="detail-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="detail-content">
              <div className="detail-label">
                {language === 'en' ? 'Phone' : 'फ़ोन'}
              </div>
              <div className="detail-value phone">
                <a href={`tel:${resource.phone}`} style={{color: 'inherit', textDecoration: 'none'}}>
                  {resource.phone}
                </a>
              </div>
            </div>
          </div>
        )}

        {resource.email && (
          <div className="resource-detail">
            <div className="detail-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="detail-content">
              <div className="detail-label">
                {language === 'en' ? 'Email' : 'ईमेल'}
              </div>
              <div className="detail-value email">
                <a href={`mailto:${resource.email}`} style={{color: 'inherit', textDecoration: 'none'}}>
                  {resource.email}
                </a>
              </div>
            </div>
          </div>
        )}

        {resource.address && (
          <div className="resource-detail">
            <div className="detail-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="detail-content">
              <div className="detail-label">
                {language === 'en' ? 'Address' : 'पता'}
              </div>
              <div className="detail-value">{resource.address}</div>
            </div>
          </div>
        )}
      </div>

      {resource.available && (
        <div className={`resource-availability ${is24x7 ? '' : 'limited'}`}>
          <span className="availability-dot"></span>
          {resource.available}
        </div>
      )}

      <div className="resource-actions">
        {resource.phone && (
          <a href={`tel:${resource.phone}`} className="action-button primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {language === 'en' ? 'Call Now' : 'अभी कॉल करें'}
          </a>
        )}
        {resource.email && (
          <a href={`mailto:${resource.email}`} className="action-button secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {language === 'en' ? 'Email' : 'ईमेल'}
          </a>
        )}
      </div>
    </div>
  );
}

export default ResourceCard;
