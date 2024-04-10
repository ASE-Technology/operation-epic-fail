using file_service.DAL;
using file_service.Models.Constants;
using file_service.Models.Interfaces.Services;
using file_service.Settings;

namespace file_service.Services
{
    public class FileService: IFileService
    {
        private readonly FileSettings _settings;
        private readonly IAuthService _authService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISignalRService _signalRService;

        public FileService(
            FileSettings fileServiceSettings,
            IAuthService authService,
            IUnitOfWork unitOfWork,
            ISignalRService signalRService)
        {
            _settings = fileServiceSettings ?? throw new ArgumentNullException(nameof(fileServiceSettings));
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _signalRService = signalRService ?? throw new ArgumentNullException(nameof(signalRService));
        }

        public async Task<IEnumerable<File>> GetUserFilesAsync()
        {
            return await _unitOfWork.FileRepository.GetFilesByUserIdAsync(_authService.UserId);
        }

        public async Task<File> GetFileByIdAsync(Guid fileId)
        {
            return await _unitOfWork.FileRepository.GetFileByIdAsync(fileId);
        }

        public async Task ImportFileAsync(IFormFile file)
        {
            using (var stream = file.OpenReadStream())
            {
                await ProcessFileAsync(file.FileName, stream, _authService.UserId);
            }
        }

        public async Task<MemoryStream> GetFileStreamAsync(File file)
        {
            var filePath = Path.Combine(_settings.LocalStoragePath, file.Filename);

            if (!System.IO.File.Exists(filePath))
            {
                throw new Exception("File not found");
            }

            var memoryStream = new MemoryStream();
            await using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memoryStream);
            }
            memoryStream.Position = 0;

            return memoryStream;
        }

        private async Task ProcessFileAsync(string fileName, Stream fileStream, string userId)
        {
            try
            {
                // Saving metadata to the database
                await SaveMetadataToDatabaseAsync(fileName, fileStream.Length, userId);

                // Uploading file to Azure Blob Storage
                //await UploadFileToBlobStorageAsync(fileName, fileStream);

                // Saving a copy of the file to the local system
                await SaveToLocalFileSystemAsync(fileName, fileStream);

                // Simulates a long running file process
                Task.Run(async () =>
                {
                    await Task.Delay(2000);
                    await _signalRService.BroadcastMethodData(_authService.UserId, SignalRMehtods.FILE_PROCESSED, "File processed successfully!");
                });
            }
            catch (Exception ex)
            {
                throw new Exception($"Error processing file: {ex.Message}");
            }
        }
        
        private async Task SaveMetadataToDatabaseAsync(string fileName, long fileSize, string userId)
        {
            await _unitOfWork.FileRepository.AddAsync(new File
            {
                Id = new Guid(),
                UserId = userId,
                DateAdded = DateTime.UtcNow,
                Filename = fileName
            });
            await _unitOfWork.CommitAsync();
        }


        private async Task SaveToLocalFileSystemAsync(string fileName, Stream fileStream)
        {
            var filePath = Path.Combine(_settings.LocalStoragePath, fileName);
            using (var fileStreamLocal = new FileStream(filePath, FileMode.Create))
            {
                await fileStream.CopyToAsync(fileStreamLocal);
            }
        }       


    }
}
