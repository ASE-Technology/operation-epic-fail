using file_service.Models.Interfaces.Services;
using file_service.Services;
using Microsoft.AspNetCore.Mvc;

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
    public IEnumerable<File> Get()
    {
        // Used to validate functionality. To be removed.
        var id = _authService.UserId;
        return Enumerable.Range(1, 5).Select(index => new File
        {
            Filename = $"{DateTime.Now.Ticks}.txt"
        })
        .ToArray();
    }

    [HttpPost(Name = "Import")]
    public async Task<IActionResult> UploadFile(IFormFile file)
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
}
