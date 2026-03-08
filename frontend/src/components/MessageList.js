import React from 'react';
import './MessageList.css';

const MessageList = ({ messages, language }) => {
  if (messages.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">💬</div>
        <p>
          {language === 'en'
            ? 'Start by sharing what\'s on your mind. You\'re in a safe space.'
            : 'अपने मन की बात साझा करके शुरुआत करें। आप एक सुरक्षित स्थान में हैं।'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.sender === 'student' ? 'message-student' : 'message-system'}`}
        >
          <div className="message-avatar">
            {message.sender === 'student' ? '👤' : '🤖'}
          </div>
          <div className="message-content">
            <div className="message-text">{message.content}</div>
            <div className="message-time">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
