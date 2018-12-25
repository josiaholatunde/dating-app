using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class Context : DbContext 
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {}
        public DbSet<User> Users { get; set; }
    }
    
}