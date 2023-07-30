using Microsoft.AspNetCore.Identity;

namespace NogorApp.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public string ProfilePicture { get; set; }
        public string Designation { get; set; }
        public string About { get; set; }
        public string FLink { get; set; } 
        public string TLink { get; set; } 
        public string LLink { get; set; } 
    }
}
