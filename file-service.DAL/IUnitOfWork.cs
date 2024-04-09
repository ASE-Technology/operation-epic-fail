using file_service.DAL.Repositories;

namespace file_service.DAL
{
    public interface IUnitOfWork : IDisposable
    {
        IFileRepository FileRepository { get; }

        Task<bool> CommitAsync();
    }
}
