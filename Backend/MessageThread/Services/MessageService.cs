using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MessageThread.Data;
using MessageThread.Models;
using Microsoft.EntityFrameworkCore;

namespace MessageThread.Services
{
    public class MessageService
    {
        private readonly ApplicationDbContext _context;

        public MessageService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all top-level messages (messages without a parent)
        public async Task<IEnumerable<Message>> GetAllMessagesAsync()
        {
            return await _context.Messages
                .Where(m => m.ParentId == null)
                .OrderBy(m => m.Timestamp)
                .Include(m => m.Replies.OrderBy(r => r.Timestamp))
                .ToListAsync();
        }

        // Get a specific message by ID with its replies
        public async Task<Message?> GetMessageByIdAsync(int id)
        {
            return await _context.Messages
                .Include(m => m.Replies.OrderBy(r => r.Timestamp))
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        // Get all replies for a specific message
        public async Task<IEnumerable<Message>> GetRepliesAsync(int messageId)
        {
            return await _context.Messages
                .Where(m => m.ParentId == messageId)
                .OrderBy(m => m.Timestamp)
                .ToListAsync();
        }

        // Add a new message (can be a top-level message or a reply)
        public async Task<Message> AddMessageAsync(Message message)
        {
            message.Timestamp = DateTime.UtcNow;
            
            // If this is a reply, validate that the parent exists
            if (message.ParentId.HasValue)
            {
                var parentExists = await _context.Messages.AnyAsync(m => m.Id == message.ParentId.Value);
                if (!parentExists)
                {
                    throw new KeyNotFoundException($"Parent message with ID {message.ParentId.Value} not found.");
                }
            }
            
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return message;
        }

        // Update an existing message
        public async Task<Message?> UpdateMessageAsync(int id, Message updatedMessage)
        {
            var existingMessage = await _context.Messages.FindAsync(id);
            if (existingMessage == null)
                return null;

            existingMessage.Content = updatedMessage.Content;
            
            await _context.SaveChangesAsync();
            return existingMessage;
        }

        // Delete a message and optionally its replies
        public async Task<bool> DeleteMessageAsync(int id, bool deleteReplies = false)
        {
            var message = await _context.Messages
                .Include(m => m.Replies)
                .FirstOrDefaultAsync(m => m.Id == id);
                
            if (message == null)
                return false;
            
            // If there are replies and deleteReplies is false, don't delete
            if (message.Replies.Any() && !deleteReplies)
            {
                return false;
            }
            
            // If deleteReplies is true, remove all replies first
            if (deleteReplies && message.Replies.Any())
            {
                _context.Messages.RemoveRange(message.Replies);
            }
            
            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();
            return true;
        }
    }
} 