using System.ComponentModel.DataAnnotations;

namespace api.Models.Forms
{
    public class ForgotPasswordVewModel
    {
        [Required(ErrorMessage = "Email je povinný.")]
        [EmailAddress(ErrorMessage = "Nesprávný formát e-mailu.")]
        public string Email { get; set; }
    }
}
