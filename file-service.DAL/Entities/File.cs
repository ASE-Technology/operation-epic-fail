using System.ComponentModel.DataAnnotations;

namespace file_service;

public class File
{
    public Guid Id { get; set; }

    [Required]
    public string Filename { get; set; }

    public string UserId { get; set; }

    public DateTime DateAdded { get; set; }
}
