using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace api.Services
{
    public class JwtService
    {
        private readonly TokenValidationParameters _tokenValidationParameters;

        public JwtService(TokenValidationParameters tokenValidationParameters)
        {
            _tokenValidationParameters = tokenValidationParameters;
        }

        public string GenerateToken(ClaimsIdentity claimsIdentity)
        {
            // Implementace generování JWT tokenu
            // ...
            return new string("");
        }

        public ClaimsPrincipal ValidateToken(string token)
        {
            SecurityToken securityToken;
            var handler = new JwtSecurityTokenHandler();
            return handler.ValidateToken(token, _tokenValidationParameters, out securityToken);
        }
    }

}
