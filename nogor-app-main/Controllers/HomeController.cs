using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NogorApp.Models;
using NogorApp.Utilities;
using NogorApp.Utilities.ViewModels;
using System.IO;

namespace NogorApp.Controllers;

public class HomeController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _hostEnv;
    private readonly RoleManager<IdentityRole> _roleManager;

    public HomeController(ApplicationDbContext context, IWebHostEnvironment hostEnv = null, RoleManager<IdentityRole> roleManager = null)
    {
        _context = context;
        _hostEnv = hostEnv;
        _roleManager = roleManager;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult ContactUs()
    {
        return View();
    }

    [HttpPost]
    public async Task<JsonResult> SendMessage(Contact contact)
    {
        Response _response = new();

        _response.message = "আপনার বার্তা সফল ভাবে পাঠানো হয়েছে।";
        _response.status = "success";
        _response.flag = 1;

        try
        {
            contact.SendOn = DateTime.Now;
            _context.Add(contact);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _response.message = ex.Message.ToString();
            _response.status = "error";
            _response.flag = 0;
        }

        return Json(_response);
    }

    [Authorize(Roles = "Administrator")]
    public IActionResult Messages()
    {
        return View();
    }

    [HttpPost, Authorize(Roles = "Administrator")]
    public JsonResult GetMessages()
    {
        return Json(new { data = _context.Contacts.OrderByDescending(_=>_.SendOn).ToList()});
    }

    [HttpPost, Authorize(Roles = "Administrator")]
    public async Task<JsonResult> DeleteMessage(Guid id)
    {
        Response _response = new();

        _response.message = "বার্তা ডিলিট করা হয়েছে।";
        _response.status = "success";
        _response.flag = 1;

        try
        {
            var contact = await _context.Contacts.Where(_ => _.Id == id).FirstOrDefaultAsync();
            if(contact == null)
            {
                _response.message = "বার্তাটি খুঁজে পাওয়া যায়নি।";
                _response.status = "error";
                _response.flag = 0;
            }
            else{
                _context.Remove(contact);
                await _context.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            _response.message = ex.Message.ToString();
            _response.status = "error";
            _response.flag = 0;
        }

        return Json(_response);
    }

    [Authorize(Roles = "Administrator")]
    public IActionResult Infos()
    {
        return View();
    }

    [HttpPost]
    public async Task<JsonResult> GetAboutInfo()
    {
        return Json(await _context.AboutInfos.Where(_ => _.Id == 1).FirstOrDefaultAsync());
    }

    [HttpPost, Authorize(Roles = "Administrator")]
    public async Task<JsonResult> UpdateAboutInfo(AboutInfoViewModel model)
    {
        Response _response = new();

        _response.message = "ডাটা আপডেট করা হয়েছে।";
        _response.status = "success";
        _response.flag = 1;

        try
        {
            var aboutInfo = await _context.AboutInfos.Where(_ => _.Id == 1).FirstOrDefaultAsync();

            if (aboutInfo == null)
            {
                _response.message = "এই ডাটা খুঁজে পাওয়া যায়নি।";
                _response.status = "error";
                _response.flag = 0;
            }
            else
            {
                if (model.Logo != null)
                {
                    if (aboutInfo.Logo != null)
                    {
                        var fdel = Path.Combine(_hostEnv.WebRootPath, aboutInfo.Logo);
                        if (System.IO.File.Exists(fdel))
                        {
                            GC.Collect();
                            GC.WaitForPendingFinalizers();
                            System.IO.File.Delete(fdel);
                        }
                    }

                    var ext = Path.GetExtension(model.Logo.FileName);
                    string filename = DateTime.Now.ToString("yyMMdd-logo-") + Guid.NewGuid().ToString() + ext;
                    string newFilePath = Path.Combine("images", filename);
                    string path = Path.Combine(_hostEnv.WebRootPath, newFilePath);
                    model.Logo.CopyTo(new FileStream(path, FileMode.Create));
                    aboutInfo.Logo = newFilePath;
                }

                aboutInfo.Email = model.Email;
                aboutInfo.Phone = model.Phone;
                aboutInfo.Address = model.Address;
                aboutInfo.AboutShort = model.AboutShort;
                aboutInfo.About = model.About;
                aboutInfo.MapLink = model.MapLink;

                _context.Update(aboutInfo);
                await _context.SaveChangesAsync();
            }

        }
        catch (Exception ex)
        {
            _response.message = ex.Message.ToString();
            _response.status = "error";
            _response.flag = 0;
        }

        return Json(_response);
    }

    public async Task<IActionResult> Search(string keyword, int page)
    {
        var result = (from q in _context.Questions
                      join d in _roleManager.Roles
                      on q.Department equals d.Id
                      where q.Status == 1 && q.Title.Contains(keyword) || q.Body.Contains(keyword)
                      select new QuestionRetriveViewModel
                      {
                          Id = q.Id,
                          Name = q.Name,
                          Title = q.Title,
                          Body = q.Body,
                          Department = d.Name,
                          DepartmentId = d.Id,
                          AskedOn = q.AskedOn,
                          Status = q.Status
                      }).OrderByDescending(q => q.AskedOn);

        if (page <= 0) page = 1;
        int pageSize = 3;

        TempData["keyword"] = keyword;
        TempData.Keep("keyword");

        return View(await PaginatedList<QuestionRetriveViewModel>.CreateAsync(result, page, pageSize));
    }


    [HttpGet]
    public IActionResult AccessDenied()
    {
        return View();
    }
}

