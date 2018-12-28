using System;

namespace DatingApp.API.DTO
{
    public class PhotoForListDto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public bool IsMain { get; set; }
    }
    
}