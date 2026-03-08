import React, { useState } from 'react';
import './MessageInput.css';

const MessageInput = ({ onSendMessage, disabled, language }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const placeholder = language === 'en'
    ? 'Type your message here... (Press Enter to send)'
    : 'अपना संदेश यहां टाइप करें... (भेजने के लिए Enter दबाएं)';

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <textarea
        className="message-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        rows="3"
        aria-label={language === 'en' ? 'Message input' : 'संदेश इनपुट'}
      />
      <button
        type="submit"
        className="send-button"
        disabled={disabled || !message.trim()}
        aria-label={language === 'en' ? 'Send message' : 'संदेश भेजें'}
      >
        {disabled ? '⏳' : '📤'}
      </button>
    </form>
  );
};

export default MessageInput;
