import React from 'react';
import './MessageBubble.css';

interface MessageBubbleProps {
  sender: 'user' | 'system';
  content: string;
  timestamp: Date;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, content, timestamp }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message-bubble-container ${sender}`}>
      <div className="message-bubble">
        {sender === 'system' && (
          <div className="message-icon">🛡️</div>
        )}
        <div className="message-content">
          {content.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        {sender === 'user' && (
          <div className="message-icon user-icon">👤</div>
        )}
      </div>
      <div className="message-time">{formatTime(timestamp)}</div>
    </div>
  );
};

export default MessageBubble;
