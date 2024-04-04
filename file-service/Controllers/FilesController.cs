using file_service.Models.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace file_service.Controllers;

[ApiController]
[Route("[controller]")]
public class FilesController : ControllerBase
{
    private readonly ILogger<FilesController> _logger;
    private readonly IAuthService _authService;

    public FilesController(ILogger<FilesController> logger, IAuthService authService)
    {
        _logger = logger;
        _authService = authService;
    }

    [HttpGet(Name = "GetFiles")]
    public IEnumerable<File> Get()
    {
        // Used to validate functionality. To be removed.
        var id = _authService.UserId;
        return Enumerable.Range(1, 5).Select(index => new File
        {
            Name = $"{DateTime.Now.Ticks}.txt"
        })
        .ToArray();
    }
}
