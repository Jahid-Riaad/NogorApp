namespace NogorApp.Models;

public class Answer
{
    public Guid Id { get; set; }
    public Guid QuestionId { get; set; }
    public string AnswererId { get; set; }
    public DateTime AnswredOn { get; set; }
    public string AnswerText { get; set; }
    public string Attachments { get; set; }
}

