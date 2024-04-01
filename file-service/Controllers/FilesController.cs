using Microsoft.AspNetCore.Mvc;

namespace file_service.Controllers;

[ApiController]
[Route("[controller]")]
public class FilesController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<FilesController> _logger;

    public FilesController(ILogger<FilesController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetFiles")]
    public IEnumerable<File> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new File
        {
            Name = $"{DateTime.Now.Ticks}.txt"
        })
        .ToArray();
    }
}
