using file_service.DAL;
using file_service.Models.Users;
using file_service.Settings;

namespace file_service.Services
{
    public class FileService
    {
        private readonly FileSettings _settings;
        private readonly IUnitOfWork _unitOfWork;

        public FileService(FileSettings fileServiceSettings, IUnitOfWork unitOfWork)
        {
            _settings = fileServiceSettings ?? throw new ArgumentNullException(nameof(fileServiceSettings));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public async Task ProcessFileAsync(string fileName, Stream fileStream, string userId)
        {
            try
            {
                // Saving metadata to the database
                await SaveMetadataToDatabaseAsync(fileName, fileStream.Length, userId);

                // Uploading file to Azure Blob Storage
                //await UploadFileToBlobStorageAsync(fileName, fileStream);

                // Saving a copy of the file to the local system
                await SaveToLocalFileSystemAsync(fileName, fileStream);
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

        //private async Task UploadFileToBlobStorageAsync(string fileName, Stream fileStream)
        //{
        //    CloudStorageAccount storageAccount;
        //    if (CloudStorageAccount.TryParse(azureStorageConnectionString, out storageAccount))
        //    {
        //        var cloudBlobClient = storageAccount.CreateCloudBlobClient();
        //        var cloudBlobContainer = cloudBlobClient.GetContainerReference("files");

        //        if (await cloudBlobContainer.CreateIfNotExistsAsync())
        //        {
        //            await cloudBlobContainer.SetPermissionsAsync(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
        //        }

        //        var cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(fileName);
        //        await cloudBlockBlob.UploadFromStreamAsync(fileStream);
        //    }
        //    else
        //    {
        //        throw new Exception("Invalid Azure Storage Account Connection String");
        //    }
        //}

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
