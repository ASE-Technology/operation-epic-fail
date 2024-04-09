namespace file_service.Models.Interfaces.Services
{
    public interface IFileService
    {
        Task<IEnumerable<File>> GetUserFilesAsync();
        Task<File> GetFileByIdAsync(Guid fileId);
        Task ImportFileAsync(IFormFile file);
        Task<MemoryStream> GetFileStreamAsync(File file);
    }
}
