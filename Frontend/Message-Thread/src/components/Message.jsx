import { useState } from 'react';
import PropTypes from 'prop-types';
import './Message.css';

function Message({ message, onDelete, onReply }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  // Handle reply submission
  const handleReplySubmit = (e) => {
    e.preventDefault();
    
    if (!replyContent.trim()) {
      return;
    }
    
    onReply(message.id, { content: replyContent });
    setReplyContent('');
    setShowReplyForm(false);
  };

  // Toggle reply form visibility
  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
    if (!showReplyForm) {
      setReplyContent('');
    }
  };

  // Toggle replies visibility
  const toggleReplies = () => {
    setIsExpanded(!isExpanded);
  };

  // Determine if this message has replies
  const hasReplies = message.replies && message.replies.length > 0;

  return (
    <div className={`message ${message.parentId ? 'message-reply' : ''}`}>
      <div className="message-header">
        <span className="message-time">{formatDate(message.timestamp)}</span>
      </div>
      
      <div className="message-content">{message.content}</div>
      
      <div className="message-actions">
        <button 
          className="reply-button" 
          onClick={toggleReplyForm}
          aria-label="Reply to message"
        >
          Reply
        </button>
        
        <button 
          className="delete-button" 
          onClick={() => onDelete(message.id)}
          aria-label="Delete message"
        >
          Delete
        </button>
        
        {hasReplies && (
          <button 
            className="toggle-replies-button" 
            onClick={toggleReplies}
            aria-label={isExpanded ? "Hide replies" : "Show replies"}
          >
            {isExpanded ? "Hide Replies" : `Show Replies (${message.replies.length})`}
          </button>
        )}
      </div>
      
      {/* Reply Form */}
      {showReplyForm && (
        <div className="reply-form-container">
          <form onSubmit={handleReplySubmit} className="reply-form">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your reply..."
              required
            />
            <div className="reply-form-actions">
              <button type="button" onClick={toggleReplyForm}>Cancel</button>
              <button type="submit">Reply</button>
            </div>
          </form>
        </div>
      )}
      
      {/* Nested Replies */}
      {hasReplies && isExpanded && (
        <div className="replies-container">
          {message.replies.map(reply => (
            <Message 
              key={reply.id} 
              message={reply} 
              onDelete={onDelete}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    parentId: PropTypes.number,
    replies: PropTypes.array
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired
};

export default Message; 