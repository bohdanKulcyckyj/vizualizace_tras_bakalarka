using System.ComponentModel.DataAnnotations;

namespace api.Models.Forms
{
    public class ForgotPasswordViewModel
    {
        [Required(ErrorMessage = "Email je povinný.")]
        [EmailAddress(ErrorMessage = "Nesprávný formát e-mailu.")]
        public string Email { get; set; }
    }
}
