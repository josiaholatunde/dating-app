using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly Context context;

        public DatingRepository(Context context)
        {
            this.context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
           var user = await context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
           return user;
        }

        public async Task<Photo> GetUserMainPhoto(int userId)
        {
           return await context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync( p => p.IsMain);
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = context.Users
                                .Include(p => p.Photos)
                                .OrderByDescending(p => p.LastActive)
                                .AsQueryable();
            users = users.Where(u => u.Id != userParams.UserId);
            users = users.Where(u => u.Gender == userParams.Gender);
            if (userParams.Likers)
            {
                var userLikers = await GetUserLikers(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }
            if (userParams.Likees)
            {
                 var userLikees = await GetUserLikers(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }
            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDob = DateTime.Now.AddYears(-userParams.MaxAge - 1);
                var maxDob = DateTime.Now.AddYears(-userParams.MinAge);
                users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }
            if (!String.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created": 
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default: 
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }
            

            return await PagedList<User>.CreateAsync(users, userParams.PageSize, userParams.PageNumber);
        }

        private async Task<IEnumerable<int>> GetUserLikers(int userId, bool likers)
        {
            var user = await context.Users
                                .Include(u => u.Likers)
                                .Include(u => u.Likees)
                                .FirstOrDefaultAsync( u => u.Id == userId);
            if (likers) {
                return user.Likers.Where(u => u.LikeeId == userId).Select( u => u.LikerId).ToList();
            } 
            else 
            {
                return user.Likees.Where(u => u.LikerId == userId).Select( u => u.LikeeId).ToList();
            }
        }

        public async Task<bool> SaveAll()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public void UpdateUser(User user)
        {
            context.Entry(user).State = EntityState.Modified;
        }
    }
}