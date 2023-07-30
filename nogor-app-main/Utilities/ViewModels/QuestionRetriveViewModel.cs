namespace NogorApp.Utilities.ViewModels;

public class QuestionRetriveViewModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
    public string Title { get; set; }
    public string Body { get; set; }
    public string DepartmentId { get; set; }
    public string Department { get; set; }
    public DateTime AskedOn { get; set; }
    public int Status { get; set; }
    public int Answers { get; set; }
    public string Files { get; set; }
}

