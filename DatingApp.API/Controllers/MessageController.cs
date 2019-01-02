using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.DTO;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IDatingRepository repo;

        public MessagesController(IMapper mapper, IDatingRepository repo)
        {
            this.mapper = mapper;
            this.repo = repo;
        }
        
        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var message = await repo.GetMessage(id);
            if (message == null)
                return NotFound("Message not found");
            return Ok(message);
        }
        [HttpPost]
        public async Task<IActionResult> SendMessage(int userId,[FromBody]CreationMessageDto creationMessageDto)
        {
      
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var recipient = await repo.GetUser(creationMessageDto.RecipientId);
            if (recipient == null)
                return NotFound("Recipient not found");
            creationMessageDto.SenderId = userId;
            var message = mapper.Map<Message>(creationMessageDto);
            repo.Add<Message>(message);
            if (await repo.SaveAll())
            {
                var messageToReturn = mapper.Map<MessageToReturnDto>(message);
                return CreatedAtRoute("GetMessage", new { id = message.Id }, messageToReturn);
            }
            return BadRequest("Unable to save message");
        }
    }
}