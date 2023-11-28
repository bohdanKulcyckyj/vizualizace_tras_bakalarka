using System.ComponentModel.DataAnnotations;

namespace api.Models.Forms
{
    public class UserProfileViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
