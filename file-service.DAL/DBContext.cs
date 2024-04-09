using Microsoft.EntityFrameworkCore;

namespace file_service.DAL
{
    public class DBContext : DbContext
    {
        public DBContext()
        {

        }

        public DBContext(DbContextOptions<DBContext> options) : base(options)
        {
        }
        public virtual DbSet<File> Files { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("public");
            //modelBuilder.Model.GetEntityTypes().Configure(e => e.SetTableName(e.DisplayName()));
            base.OnModelCreating(modelBuilder);
            
        }
    }
}
