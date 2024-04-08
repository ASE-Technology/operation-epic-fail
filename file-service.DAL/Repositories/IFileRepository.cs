using System.Reflection.Metadata;

namespace file_service.DAL.Repositories
{
    public interface IFileRepository
    {
        Task AddAsync(File document);

        Task<File> GetByIdAsync(Guid id);
    }
}
