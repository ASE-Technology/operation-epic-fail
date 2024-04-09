namespace file_service.Models.Interfaces.Services
{
    public interface ISignalRService
    {
        Task BroadcastMethodData(string groupName, string method, object value);
    }
}
