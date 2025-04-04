import { useState } from 'react';
import PropTypes from 'prop-types';
import './MessageForm.css';

function MessageForm({ onSubmit }) {
  // Form state
  const [message, setMessage] = useState({
    content: ''
  });
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!message.content.trim()) {
      alert('Please enter a message');
      return;
    }
    
    // Submit the message
    onSubmit(message);
    
    // Reset form
    setMessage({
      content: ''
    });
  };
  
  return (
    <div className="message-form-container">
      <h2>Post a Message</h2>
      <form className="message-form" onSubmit={handleSubmit}>        
        <div className="form-group">
          <label htmlFor="content">Message</label>
          <textarea
            id="content"
            name="content"
            value={message.content}
            onChange={handleChange}
            placeholder="Type your message here..."
            rows="4"
            required
          />
        </div>
        
        <button type="submit" className="submit-button">
          Post Message
        </button>
      </form>
    </div>
  );
}

MessageForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default MessageForm; 