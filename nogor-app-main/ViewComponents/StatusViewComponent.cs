using Microsoft.AspNetCore.Mvc;
using NogorApp.Models;

namespace NogorApp.ViewComponents;

public class StatusViewComponent : ViewComponent
{
    private readonly ApplicationDbContext _context;

    public StatusViewComponent(ApplicationDbContext context)
    {
        _context = context;
    }

    public IViewComponentResult Invoke()
    {
        ViewBag.Report = _context.Questions.Count();
        ViewBag.Response = _context.Answers.Count();
        return View();
    }
}

