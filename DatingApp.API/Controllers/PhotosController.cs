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
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository repo;
        private readonly IMapper mapper;
        private readonly IOptions<object> cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            this.repo = repo;
            this.mapper = mapper;
            this.cloudinaryConfig = cloudinaryConfig;
            Account account = new Account(
                cloudinaryConfig.Value.CloudName,
                cloudinaryConfig.Value.ApiKey,
                cloudinaryConfig.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(account);
        }
        [HttpGet("{id}", Name ="GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await repo.GetPhoto(id);
            var photo = mapper.Map<Photo, PhotoForReturnDto>(photoFromRepo);
            return Ok(photo);
        }
        [HttpPost("file")]
        public string Upload(int userId, IFormFile fileToUpload)
        {
            return "Ade";
        }
        // GET api/values
        [HttpPost]
        public async Task<IActionResult> PostPhoto(int userId,[FromForm]PhotoForCreationDto photoForCreationDto)
        {
      
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var userFromRepo = await repo.GetUser(userId);
            var file = photoForCreationDto.File;
            var uploadResult = new ImageUploadResult();
            if(file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams(){
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            photoForCreationDto.Url = uploadResult.Uri.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;

            var photo = mapper.Map<PhotoForCreationDto, Photo>(photoForCreationDto);
            if(!userFromRepo.Photos.Any(p => p.IsMain))
                photo.IsMain = true;
            
            userFromRepo.Photos.Add(photo);
            if(await repo.SaveAll())
            {
                var photoToReturn = mapper.Map<Photo,PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.Id }, photoToReturn);
            }

            return BadRequest("Could not uploaded photo on save");
        }

        [HttpDelete("{photoId}")]
        public async Task<IActionResult> DeletePhoto(int userId, int photoId)
        {
      
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var userFromRepo = await repo.GetUser(userId);
            if(!userFromRepo.Photos.Any(p => p.Id == photoId))
            {
                return Unauthorized();
            }
            var photoFromRepo = await repo.GetPhoto(photoId);
            if (photoFromRepo.IsMain)
                return BadRequest("You can not delete your main Photo");
            if(photoFromRepo.PublicId != null)
            {
                var deletionParams = new DeletionParams(photoFromRepo.PublicId);
                var result = _cloudinary.Destroy(deletionParams);
                if (result.Result == "ok")
                    repo.Delete<Photo>(photoFromRepo);
            }
            if (photoFromRepo.PublicId == null)
                repo.Delete<Photo>(photoFromRepo);

            if(await repo.SaveAll())
                return Ok();
                
            return BadRequest($"Failure in deleting photo with id {photoId}");

        }
        [HttpPost("{photoId}/SetMain")]
        public async Task<IActionResult> SetUserMainPhoto(int userId, int photoId)
        {
      
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var user = await repo.GetUser(userId);
            if(!user.Photos.Any(p => p.Id == photoId))
                return Unauthorized();

            var photoFromRepo = await repo.GetPhoto(photoId);
            if(photoFromRepo.IsMain)
                return BadRequest("Photo is already main photo");
            var currentMainPhoto = user.Photos.FirstOrDefault(p => p.IsMain);
            currentMainPhoto.IsMain = false;

            photoFromRepo.IsMain = true;

            if(await repo.SaveAll()) 
            {
                return NoContent();
            }

            return BadRequest("Unable to set main photo");
        }
    }

}
