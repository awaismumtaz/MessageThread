using Microsoft.EntityFrameworkCore;
using MessageThread.Models;

namespace MessageThread.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure the Message entity
            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.Timestamp).IsRequired();
                
                // Configure the self-referencing relationship
                entity.HasOne(e => e.Parent)
                    .WithMany(e => e.Replies)
                    .HasForeignKey(e => e.ParentId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
} 