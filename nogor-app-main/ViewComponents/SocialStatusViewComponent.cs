using Microsoft.AspNetCore.Mvc;
using NogorApp.Models;

namespace NogorApp.ViewComponents;

public class SocialStatusViewComponent : ViewComponent
{
    //private readonly ApplicationDbContext _context;

    //public SocialStatusViewComponent(ApplicationDbContext context)
    //{
    //    _context = context;
    //}

    public IViewComponentResult Invoke()
    {
        return View();
    }
}

