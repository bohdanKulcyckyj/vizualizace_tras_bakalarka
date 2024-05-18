namespace api.Models.DTO
{
    public class UserDTO
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string? Role { get; set; }
        public string Name { get; set; }

        public UserDTO(string id, string email, string? role, string name) {
            Id = id;
            Email = email;
            Role = role;
            Name = name;
        }

        public UserDTO(ApplicationUser u, string? role) {
            Id = u.Id;
            Email = u.Email;
            Name = u.Name;
            Role = role;
        }
    }
}
