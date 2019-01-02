using System;

namespace DatingApp.API.DTO
{
    public class MessageToReturnDto
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public string Content { get; set; }
        public DateTime MessageSent { get; set; }
        public MessageToReturnDto()
        {
            MessageSent = DateTime.Now;
        }
    }
    
}