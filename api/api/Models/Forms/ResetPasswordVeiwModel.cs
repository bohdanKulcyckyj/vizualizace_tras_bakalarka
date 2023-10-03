using System.ComponentModel.DataAnnotations;

namespace api.Models.Forms
{
    public class ResetPasswordVeiwModel
    {
        [Required(ErrorMessage = "Email je povinný.")]
        [EmailAddress(ErrorMessage = "Nesprávný formát e-mailu.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Obnovovací token je povinný.")]
        public string Token { get; set; }

        [Required(ErrorMessage = "Nové heslo je povinné.")]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }

        [Compare("NewPassword", ErrorMessage = "Heslo a potvrzení hesla se neshodují.")]
        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }
    }
}
