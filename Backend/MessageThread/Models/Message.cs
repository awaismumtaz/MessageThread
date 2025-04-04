using System;
using System.Collections.Generic;

namespace MessageThread.Models
{
    public class Message
    {
        public int Id { get; set; }
        
        public string Content { get; set; } = string.Empty;
        
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        
        // Parent message ID (null if it's a top-level message)
        public int? ParentId { get; set; }
        
        // Navigation property for the parent message
        public Message? Parent { get; set; }
        
        // Navigation property for reply messages
        public List<Message> Replies { get; set; } = new List<Message>();
    }
} 