namespace NogorApp.Utilities.ViewModels
{
    public class QuestionViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public string Department { get; set; }
        public DateTime AskedOn { get; set; }
        public int Status { get; set; }
        public List<IFormFile> Files { get; set; }
    }
}
