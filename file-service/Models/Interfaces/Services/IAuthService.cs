using file_service.Models.Users;

namespace file_service.Models.Interfaces.Services
{
    public interface IAuthService
    {
        string UserId { get; }
        string Email { get; }
        string Role { get; }

        void SetCurrentUser(User currentUser);
    }
}
