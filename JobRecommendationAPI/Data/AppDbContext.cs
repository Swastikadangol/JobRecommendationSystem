using JobRecommendationAPI.Enums;
using JobRecommendationAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace JobRecommendationAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        //all 5 tables (it will makes table in database)
        public DbSet<User> Users { get; set; }
        public DbSet<JobSeeker> JobSeekers { get; set; }
        public DbSet<Employer> Employers { get; set; }
        public DbSet<Experience> Experiences { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Application> Applications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //unique email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email).IsUnique();

            //user -> jobseeker (1 to )
            modelBuilder.Entity<User>()
                .HasOne(u => u.JobSeekerProfile)      // User has one JobSeekerProfile
                .WithOne(js => js.User)               // JobSeekerProfile has one User (back reference)
                .HasForeignKey<JobSeeker>(js => js.UserId)  // FK is UserId on JobSeeker table
                .OnDelete(DeleteBehavior.Cascade);    // If User deleted → JobSeeker deleted too

            //user -> employer (1 to 1)
            modelBuilder.Entity<User>()
                .HasOne(u => u.EmployerProfile)
                .WithOne(e => e.User)
                .HasForeignKey<Employer>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // JobSeeker -> Experience (1 to many)
            modelBuilder.Entity<JobSeeker>()
                .HasMany(js => js.Experiences)
                .WithOne(ex => ex.JobSeeker)
                .HasForeignKey(ex => ex.JobSeekerId)
                .OnDelete(DeleteBehavior.Cascade);

            //employer -> job (1 to many)
            modelBuilder.Entity<Employer>()
                .HasMany(e => e.Jobs)
                .WithOne(j => j.Employer)
                .HasForeignKey(j => j.EmployerId)
                .OnDelete(DeleteBehavior.Cascade);

            //job -> applications ( 1 to many)
            modelBuilder.Entity<Job>()
                .HasMany(j => j.Applications)
                .WithOne(a => a.Job)
                .HasForeignKey(a => a.JobId)
                .OnDelete(DeleteBehavior.Cascade);

            //jobseeker -> applications ( 1 to many)
            modelBuilder.Entity<JobSeeker>()
                .HasMany(js => js.Applications)
                .WithOne(a => a.JobSeeker)
                .HasForeignKey(a => a.JobSeekerId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<User>()
    .Property(u => u.Role)
    .HasConversion<string>();

            modelBuilder.Entity<User>()
                .Property(u => u.Status)
                .HasConversion<string>();

            //ssed admin user ( password: admin123)
            //BCrypt is a password hashing algorithm — it converts a plain password into a secure, unreadable hash.
            // Seed admin user (password: admin123)
//             Email: admin@jobrec.com
// Password: Admin@123
            modelBuilder.Entity<User>().HasData(new User
            {
                UserId = 1,
                UserName = "admin",
                Email = "admin@jobrec.com",
                Password = "$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyNa1g8Ue.",
                Role = Role.Admin,
                Status = UserStatus.Active,
                CreatedAt = new DateTime(2026, 1, 1)
            });

        }



        
    }
}
