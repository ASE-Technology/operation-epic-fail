using Microsoft.EntityFrameworkCore;

namespace file_service.DAL.Repositories
{
    public class FileRepository : IFileRepository
    {
        #region Private Properties

        private readonly DBContext _context;

        #endregion

        public FileRepository(DBContext context)
        {
            _context = context;
        }

        public async Task AddAsync(File document)
        {
            await _context.Files.AddAsync(document);
        }

        public async Task<File> GetFileByIdAsync(Guid id)
        {
            return await _context.Files.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<File>> GetFilesByUserIdAsync(string userId)
        {
            var files = await _context.Files
                .Where(x => x.UserId == userId)
                .ToListAsync();

            return files;
        }
    }
}
