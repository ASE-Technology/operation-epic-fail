using file_service.Middlewares;

namespace file_service.Extensions
{
    public static class JwtValidationMiddlewareExtensions
    {
        public static IApplicationBuilder UseJwtValidation(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<JwtValidationMiddleware>();
        }
    }
}
