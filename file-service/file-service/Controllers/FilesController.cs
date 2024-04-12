using file_service.Models.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace file_service.Controllers;

[ApiController]
[Route("[controller]")]
public class FilesController : ControllerBase
{
    private readonly IFileService _fileService;

    public FilesController(IFileService fileService)
    {
        _fileService = fileService;
    }

    [HttpGet(Name = nameof(GetUserFiles))]
    public async Task<IEnumerable<File>> GetUserFiles()
    {
        return await _fileService.GetUserFilesAsync();     
    }

    [HttpPost(Name = nameof(ImportFile))]
    public async Task<IActionResult> ImportFile([Required] IFormFile file)
    {
        await _fileService.ImportFileAsync(file);

        return Ok();
    }

    [HttpGet("{id}", Name = nameof(GetFileStream))]
    public async Task<IActionResult> GetFileStream([FromRoute] Guid id)
    {
        var file = await _fileService.GetFileByIdAsync(id);
        if (file == null)
        {
            return NotFound();
        }

        var fileStream = await _fileService.GetFileStreamAsync(file);

        return File(fileStream, "application/octet-stream");
    }
}