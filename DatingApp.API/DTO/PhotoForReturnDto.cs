using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.DTO
{
    public class PhotoForReturnDto
    {
        public string Url { get; set; }
        public int Id { get; set; }
        public string Description { get; set; }
        public string PublicId { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }
     
    }
    
}