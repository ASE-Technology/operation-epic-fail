using file_service.DAL;
using file_service.Models.Interfaces.Services;
using file_service.Services;
using file_service.Settings;
using Microsoft.AspNetCore.Http;
using Moq;

namespace file_service.test
{
    public class FileServiceTests
    {
        private FileService _fileService;
        private Mock<IUnitOfWork> _mockUnitOfWork;
        private Mock<IAuthService> _mockAuthService;
        private Mock<ISignalRService> _mockSignalRService;

        public FileServiceTests ()
        {
            // Mock dependencies
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockAuthService = new Mock<IAuthService>();
            _mockSignalRService = new Mock<ISignalRService>();

            // Create FileService instance
            _fileService = new FileService(new FileSettings(), _mockAuthService.Object, _mockUnitOfWork.Object, _mockSignalRService.Object);
        }

        [Fact]
        public async Task GetUserFilesAsync_ReturnsUserFiles()
        {
            // Arrange
            var userId = "user123";
            var files = new List<File> { new File { Id = Guid.NewGuid(), UserId = userId, Filename = "file1.txt" } };
            _mockAuthService.Setup(m => m.UserId).Returns(userId);
            _mockUnitOfWork.Setup(m => m.FileRepository.GetFilesByUserIdAsync(userId)).ReturnsAsync(files);

            // Act
            var result = await _fileService.GetUserFilesAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(files, result);
        }

        [Fact]
        public async Task GetFileByIdAsync_ReturnsFile()
        {
            // Arrange
            var fileId = Guid.NewGuid();
            var file = new File { Id = fileId, Filename = "file1.txt" };
            _mockUnitOfWork.Setup(m => m.FileRepository.GetFileByIdAsync(fileId)).ReturnsAsync(file);

            // Act
            var result = await _fileService.GetFileByIdAsync(fileId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(file, result);
        }

        [Fact]
        public async Task GetFileStreamAsync_ReturnsFileStream()
        {
            // Arrange
            var file = new File { Filename = "TestFile.txt" };
            var memoryStream = new MemoryStream();
            _mockUnitOfWork.Setup(m => m.FileRepository.GetFileByIdAsync(It.IsAny<Guid>())).ReturnsAsync(file);
            var baseDirectory = AppContext.BaseDirectory;
            _fileService = new FileService(new FileSettings { LocalStoragePath = Path.GetFullPath(Path.Combine(baseDirectory, "..","..","..")) }, _mockAuthService.Object, _mockUnitOfWork.Object, _mockSignalRService.Object);
            var expectedFileStream = new MemoryStream();
            var relativePath = Path.Combine("..", "..", "..", file.Filename);
            var filePath = Path.GetFullPath(Path.Combine(baseDirectory, relativePath));
            using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write))
            {
                await expectedFileStream.CopyToAsync(fileStream);
            }
            expectedFileStream.Position = 0;

            // Act
            var result = await _fileService.GetFileStreamAsync(file);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedFileStream.Length, result.Length);
        }
    }
}
