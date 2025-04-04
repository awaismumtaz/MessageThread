import { useState, useEffect } from 'react';
import messageService from '../services/messageService';
import Message from '../components/Message';
import MessageForm from '../components/MessageForm';
import './MessageList.css';

function MessageList() {
  // State for messages
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Function to fetch messages from API
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await messageService.getMessages();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch messages. Please try again later.');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a new message
  const handleCreateMessage = async (messageData) => {
    try {
      const newMessage = await messageService.createMessage(messageData);
      setMessages([...messages, newMessage]);
    } catch (err) {
      setError('Failed to create message. Please try again.');
      console.error('Error creating message:', err);
    }
  };

  // Handle replying to a message
  const handleReplyToMessage = async (parentId, replyData) => {
    try {
      const newReply = await messageService.replyToMessage(parentId, replyData);
      
      // Find the parent message and add the reply to it
      const updatedMessages = messages.map(message => {
        if (message.id === parentId) {
          return {
            ...message,
            replies: [...(message.replies || []), newReply]
          };
        }
        
        // Check if the parent is a nested reply
        if (message.replies && message.replies.length > 0) {
          const updatedReplies = updateRepliesInThread(message.replies, parentId, newReply);
          if (updatedReplies !== message.replies) {
            return {
              ...message,
              replies: updatedReplies
            };
          }
        }
        
        return message;
      });
      
      setMessages(updatedMessages);
    } catch (err) {
      setError('Failed to reply to message. Please try again.');
      console.error('Error replying to message:', err);
    }
  };

  // Helper function to update replies in a nested thread
  const updateRepliesInThread = (replies, parentId, newReply) => {
    let updated = false;
    
    const updatedReplies = replies.map(reply => {
      if (reply.id === parentId) {
        updated = true;
        return {
          ...reply,
          replies: [...(reply.replies || []), newReply]
        };
      }
      
      if (reply.replies && reply.replies.length > 0) {
        const nestedUpdatedReplies = updateRepliesInThread(reply.replies, parentId, newReply);
        if (nestedUpdatedReplies !== reply.replies) {
          updated = true;
          return {
            ...reply,
            replies: nestedUpdatedReplies
          };
        }
      }
      
      return reply;
    });
    
    return updated ? updatedReplies : replies;
  };

  // Handle deleting a message
  const handleDeleteMessage = async (id) => {
    try {
      // First check if this message has replies
      const messageToDelete = findMessageInThread(messages, id);
      
      if (messageToDelete && messageToDelete.replies && messageToDelete.replies.length > 0) {
        if (!window.confirm('This message has replies. Delete this message and all its replies?')) {
          return;
        }
        await messageService.deleteMessage(id, true);
      } else {
        await messageService.deleteMessage(id);
      }
      
      // If it's a top-level message, remove it from the messages array
      if (!messageToDelete.parentId) {
        setMessages(messages.filter(message => message.id !== id));
      } else {
        // If it's a reply, we need to update the parent message
        setMessages(removeReplyFromThread(messages, id));
      }
    } catch (err) {
      setError('Failed to delete message. Please try again.');
      console.error('Error deleting message:', err);
    }
  };

  // Helper function to find a message in the thread by ID
  const findMessageInThread = (messagesList, id) => {
    for (const message of messagesList) {
      if (message.id === id) {
        return message;
      }
      
      if (message.replies && message.replies.length > 0) {
        const foundInReplies = findMessageInThread(message.replies, id);
        if (foundInReplies) {
          return foundInReplies;
        }
      }
    }
    
    return null;
  };

  // Helper function to remove a reply from a thread
  const removeReplyFromThread = (messagesList, id) => {
    return messagesList.map(message => {
      // Check if this message has the reply we need to remove
      if (message.replies && message.replies.length > 0) {
        return {
          ...message,
          replies: message.replies.filter(reply => {
            if (reply.id === id) {
              return false;
            }
            
            // If this reply has nested replies, recursively check them
            if (reply.replies && reply.replies.length > 0) {
              const updatedNestedReplies = removeReplyFromThread([reply], id);
              return updatedNestedReplies[0];
            }
            
            return true;
          })
        };
      }
      
      return message;
    });
  };

  return (
    <div className="message-list-page">
      <h1>Message Thread</h1>
      
      {/* Message Form */}
      <MessageForm onSubmit={handleCreateMessage} />
      
      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Messages List */}
      <div className="messages-container">
        <h2>Messages</h2>
        
        {loading ? (
          <div className="loading">Loading messages...</div>
        ) : messages.length > 0 ? (
          <div className="messages-list">
            {messages.map(message => (
              <Message 
                key={message.id} 
                message={message} 
                onDelete={handleDeleteMessage}
                onReply={handleReplyToMessage}
              />
            ))}
          </div>
        ) : (
          <div className="no-messages">
            No messages yet. Be the first to post!
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageList; 