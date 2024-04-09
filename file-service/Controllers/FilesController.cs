using file_service.Models.Constants;
using file_service.Models.Interfaces.Services;
using file_service.Models.Users;
using file_service.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections;

namespace file_service.Controllers;

[ApiController]
[Route("[controller]")]
public class FilesController : ControllerBase
{
    private readonly ILogger<FilesController> _logger;
    private readonly IAuthService _authService;
    private readonly FileService _fileService;

    public FilesController(
        ILogger<FilesController> logger, 
        IAuthService authService,
        FileService fileService)
    {
        _logger = logger;
        _fileService = fileService;
        _authService = authService;
    }

    [HttpGet(Name = "GetFiles")]
    public async Task<IEnumerable<File>> Get()
    {
        var id = _authService.UserId;

        var files = await _fileService.GetFilesAsync(id);

        return files;        
    }

    [HttpPost(Name = "Import")]
    public async Task<IActionResult> ImportFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("Empty file");
        }

        var id = _authService.UserId;
        using (var stream = file.OpenReadStream())
        {
            await _fileService.ProcessFileAsync(file.FileName, stream, id);
        }

        return Ok();
    }

    [HttpGet("{id}",Name = "Export")]
    public async Task<IActionResult> ExportFile([FromRoute] Guid id)
    {
        var fileResult = await _fileService.GetFileAsync(id);

        if (fileResult == null)
        {
            return NotFound();
        }

        return fileResult;
    }
}
