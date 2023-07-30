namespace NogorApp.Utilities.ViewModels
{
    public class UserViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public IFormFile ProfilePicture { get; set; }
        public string Designation { get; set; }
        public string About { get; set; }
        public string FLink { get; set; }
        public string TLink { get; set; }
        public string LLink { get; set; }
    }
}
