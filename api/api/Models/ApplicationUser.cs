using Microsoft.AspNetCore.Identity;

namespace api.Models
{
    public class ApplicationUser : IdentityUser
    {
        string id;
        string email;
        string password;
        string name;
        List<Map> maps;
    }
}
