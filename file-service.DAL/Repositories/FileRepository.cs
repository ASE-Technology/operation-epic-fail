using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

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
            //var documentEntity = _mapper.Map<Entities.Document>(document);
            await _context.Files.AddAsync(document);
        }

        public async Task<File> GetByIdAsync(Guid id)
        {
            var documentEntity = await _context.Files.FirstOrDefaultAsync(x => x.Id == id);
            //return _mapper.Map<Document>(documentEntity);
            return documentEntity;
        }
    }
}
