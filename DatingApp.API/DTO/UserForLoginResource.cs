using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.DTO
{
    public class UserForLoginResource
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [StringLength(255)]
        public string Password { get; set; }
      
    }    
}