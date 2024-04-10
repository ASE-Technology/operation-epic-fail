using file_service.Controllers;
using file_service.Models.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace file_service.tests
{
    public class FilesControllerTests
    {
        private readonly Mock<IFileService> _fileServiceMock;
        private readonly FilesController _filesController;
        public FilesControllerTests()
        {
            _fileServiceMock = new Mock<IFileService>();
            _filesController = new FilesController(_fileServiceMock.Object);
        }
        [Fact]
        public async Task GetUserFiles_ReturnsFiles()
        {
            var files = new List<File> { new File { Id = Guid.NewGuid(), Filename = "file.txt" } };
            _fileServiceMock.Setup(s => s.GetUserFilesAsync()).ReturnsAsync(files);
            var result = await _filesController.GetUserFiles();
            Assert.Equal(files, result);
        }
        [Fact]
        public async Task ImportFile_ReturnsOk()
        {
            var file = new Mock<IFormFile>();
            _fileServiceMock.Setup(s => s.ImportFileAsync(file.Object)).Returns(Task.CompletedTask);
            var result = await _filesController.ImportFile(file.Object) as OkResult;
            Assert.NotNull(result);
        }
        [Fact]
        public async Task GetFileStream_ReturnsFile()
        {
            var fileId = Guid.NewGuid();
            var file = new File { Id = fileId, Filename = "file.txt" };
            var fileStream = new MemoryStream();
            _fileServiceMock.Setup(s => s.GetFileByIdAsync(fileId)).ReturnsAsync(file);
            _fileServiceMock.Setup(s => s.GetFileStreamAsync(file)).ReturnsAsync(fileStream);
            var result = await _filesController.GetFileStream(fileId) as FileStreamResult;
            Assert.NotNull(result);
            Assert.Equal("application/octet-stream", result.ContentType);
        }
        [Fact]
        public async Task GetFileStream_ReturnsNotFound()
        {
            var fileId = Guid.NewGuid();
            _fileServiceMock.Setup(s => s.GetFileByIdAsync(fileId)).ReturnsAsync((File)null);
            var result = await _filesController.GetFileStream(fileId) as NotFoundResult;
            Assert.NotNull(result);
        }
    }
}