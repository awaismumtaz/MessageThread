using Microsoft.AspNetCore.Mvc;
using MessageThread.Models;
using MessageThread.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MessageThread.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly MessageService _messageService;

        public MessagesController(MessageService messageService)
        {
            _messageService = messageService;
        }

        // GET: api/messages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Message>>> GetMessages()
        {
            var messages = await _messageService.GetAllMessagesAsync();
            return Ok(messages);
        }
        
        // GET: api/messages/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Message>> GetMessage(int id)
        {
            var message = await _messageService.GetMessageByIdAsync(id);

            if (message == null)
            {
                return NotFound();
            }

            return Ok(message);
        }
        
        // GET: api/messages/{id}/replies
        [HttpGet("{id}/replies")]
        public async Task<ActionResult<IEnumerable<Message>>> GetReplies(int id)
        {
            // Check if the parent message exists
            var parentExists = await _messageService.GetMessageByIdAsync(id);
            if (parentExists == null)
            {
                return NotFound("Parent message not found");
            }
            
            var replies = await _messageService.GetRepliesAsync(id);
            return Ok(replies);
        }

        // POST: api/messages
        [HttpPost]
        public async Task<ActionResult<Message>> PostMessage(Message message)
        {
            try
            {
                var createdMessage = await _messageService.AddMessageAsync(message);
                return CreatedAtAction(nameof(GetMessage), new { id = createdMessage.Id }, createdMessage);
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        // POST: api/messages/{id}/reply
        [HttpPost("{id}/reply")]
        public async Task<ActionResult<Message>> ReplyToMessage(int id, Message reply)
        {
            // Check if the parent message exists
            var parentMessage = await _messageService.GetMessageByIdAsync(id);
            if (parentMessage == null)
            {
                return NotFound("Parent message not found");
            }
            
            // Set the parent ID
            reply.ParentId = id;
            
            try
            {
                var createdReply = await _messageService.AddMessageAsync(reply);
                return CreatedAtAction(nameof(GetMessage), new { id = createdReply.Id }, createdReply);
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/messages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, [FromQuery] bool deleteReplies = false)
        {
            var result = await _messageService.DeleteMessageAsync(id, deleteReplies);
            
            if (!result)
            {
                if (!deleteReplies)
                {
                    return BadRequest("Cannot delete a message with replies. Set 'deleteReplies=true' to delete the message and all its replies.");
                }
                
                return NotFound();
            }

            return NoContent();
        }
    }
} 