using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTO;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository repo;
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;

        public UsersController(IDatingRepository repo, IConfiguration configuration, IMapper mapper)
        {
            this.repo = repo;
            this.configuration = configuration;
            this.mapper = mapper;
        }
        // GET api/values
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userFromRepo = await repo.GetUser(userId);
            userParams.UserId = userId;
            if (String.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = userFromRepo.Gender == "male" ? "female" : "male";
            }
            var users = await repo.GetUsers(userParams);
            var userToReturn = mapper.Map<IEnumerable<User>, IEnumerable<UserForListDto>>(users);
           Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalPages, users.TotalCount);
            return Ok(userToReturn);
        }
         [HttpGet("{id}", Name="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await repo.GetUser(id);
            var userToReturn = mapper.Map<User, UserForDetailDto>(user);
            return Ok(userToReturn);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody]UserForUpdateDto userForUpdateDto)
        {

            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var userFromRepo =await repo.GetUser(id);
            var userToUpdate =mapper.Map(userForUpdateDto, userFromRepo);
            repo.UpdateUser(userToUpdate);
            if (await repo.SaveAll())
                return NoContent();
            throw new Exception($"Updating user with id {id} failed on save");
            
        }
         [HttpPost("{userId}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int userId, int recipientId)
        {
             if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            if (await repo.GetUser(recipientId) == null)
                return NotFound("Recipient User does not exist");
            var like = await repo.GetLike(userId, recipientId);
            if (like != null)
                return BadRequest("You have liked this user before");
            var userLike = new Like { 
                LikerId = userId,
                LikeeId = recipientId
            };
            repo.Add<Like>(userLike);
            if(await repo.SaveAll())
                return Ok();
            return BadRequest("Unable to Like User");


        }
    }
}