using System.ComponentModel.DataAnnotations;

namespace NogorApp.Utilities.ViewModels
{
    public class RegisterViewModel
    {
        public string Id { get; set; }

        public string Name { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        public string Password { get; set; }

        [Compare("Password")]
        public string ConfirmPassword { get; set; }
    }
}
