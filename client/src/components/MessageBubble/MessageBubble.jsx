import React from 'react';

const MessageBubble = ({ message, sender }) => {
  return (
    <div className={`message-bubble ${sender}`}>
      <p>{message}</p>
    </div>
  );
};

export default MessageBubble;
