using file_service.DAL.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace file_service.DAL
{
    public class UnitOfWork : IUnitOfWork
    {
        #region Private Properties

        private readonly DBContext _context;

        private IFileRepository _fileRepository;

        #endregion

        #region Constructor

        public UnitOfWork(DBContext context, ILogger<UnitOfWork> logger)
        {
            _context = context;
        }

        #endregion

        #region Repositories
        public IFileRepository FileRepository => _fileRepository ??= new FileRepository(_context);

        #endregion

        /// <summary>
        /// Saves all pending changes in the db context
        /// </summary>
        public async Task<bool> CommitAsync()
        {
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateException dbUpdateEx)
            {
                return false;
            }
        }

        public void Dispose() => _context.Dispose();
    }
}
