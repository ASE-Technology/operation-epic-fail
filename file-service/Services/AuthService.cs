using file_service.Models.Interfaces.Services;
using file_service.Models.Users;

namespace file_service.Services
{
    public class AuthService : IAuthService
    {
        private User _currentUser;

        public string UserId => _currentUser.Id;
        public string Email => _currentUser.Email;
        public string Role => _currentUser.Role;

        public void SetCurrentUser(User currentUser)
        {
            _currentUser = currentUser;
        }
    }
}
