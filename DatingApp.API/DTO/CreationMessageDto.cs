using System;

namespace DatingApp.API.DTO
{
    public class CreationMessageDto
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public string Content { get; set; }
        public DateTime MessageSent { get; set; }
        public CreationMessageDto()
        {
            MessageSent = DateTime.Now;
        }
    }
    
}