using file_service.Models.Constants;
using file_service.Models.Interfaces.Services;
using file_service.Models.Users;
using Microsoft.AspNetCore.Mvc;

namespace file_service.Controllers;

[ApiController]
[Route("[controller]")]
public class FilesController : ControllerBase
{
    private readonly ILogger<FilesController> _logger;
    private readonly IAuthService _authService;
    private readonly ISignalRService _signalRService;

    public FilesController(ILogger<FilesController> logger, IAuthService authService, ISignalRService signalRService)
    {
        _logger = logger;
        _authService = authService;
        _signalRService = signalRService;
    }

    [HttpGet(Name = "GetFiles")]
    public async Task<IEnumerable<File>> Get()
    {
        // Used to validate functionality. To be removed.
        var id = _authService.UserId;
        await Task.Delay(TimeSpan.FromSeconds(3));
        await _signalRService.BroadcastMethodData(id, SignalRMehtods.FILE_PROCESSED, "File processed");

        return Enumerable.Range(1, 5).Select(index => new File
        {
            Name = $"{DateTime.Now.Ticks}.txt"
        })
        .ToArray();
    }
}
