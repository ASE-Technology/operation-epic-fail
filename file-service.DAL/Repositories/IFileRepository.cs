using System.Reflection.Metadata;

namespace file_service.DAL.Repositories
{
    public interface IFileRepository
    {
        Task AddAsync(File document);

        Task<File> GetFileByIdAsync(Guid fileId);
        Task<List<File>> GetFilesByUserIdAsync(string userId);
    }
}
