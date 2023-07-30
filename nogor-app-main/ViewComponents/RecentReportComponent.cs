using Microsoft.AspNetCore.Mvc;
using NogorApp.Models;

namespace NogorApp.ViewComponents;

public class RecentReportViewComponent : ViewComponent
{
    private readonly ApplicationDbContext _context;

    public RecentReportViewComponent(ApplicationDbContext context)
    {
        _context = context;
    }

    public IViewComponentResult Invoke()
    {
        ViewBag.RPost = _context.Questions.Where(_=>_.Status == 1).OrderByDescending(x => x.AskedOn).Take(2);
        return View();
    }
}

