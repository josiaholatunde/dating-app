using System;
using System.Linq;
using AutoMapper;
using DatingApp.API.DTO;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserForListDto>()
            .ForMember(dest => dest.PhotoUrl, opt => {
                opt.MapFrom(u => u.Photos.FirstOrDefault(p => p.IsMain).Url);
            });
            CreateMap<User, UserForDetailDto>()
             .ForMember(dest => dest.PhotoUrl, opt => {
                opt.MapFrom(u => u.Photos.FirstOrDefault(p => p.IsMain).Url);
            });
            CreateMap<Photo, PhotoForListDto>();
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<Message, MessageToReturnDto>();

            //API Resources to Domain classes
            CreateMap<UserForUpdateDto, User>();
            CreateMap<PhotoForCreationDto,Photo>();
            CreateMap<UserForRegisterDto, User>();
            CreateMap<CreationMessageDto, Message>();

        }
    }
    
}