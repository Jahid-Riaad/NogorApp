using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NogorApp.Data.Interfaces;
using NogorApp.Models;
using NogorApp.Utilities;
using NogorApp.Utilities.ViewModels;

namespace NogorApp.Controllers
{
    public class QuestionController : Controller
    {
        private readonly IQuestion _question;
        private readonly UserManager<ApplicationUser> _userManager;

        public QuestionController(IQuestion question, UserManager<ApplicationUser> userManager)
        {
            _question = question;
            _userManager = userManager;
        }

        public IActionResult Report()
        {
            return View();
        }

        public JsonResult AddReport(QuestionViewModel model)
        {
            return Json(_question.AddReport(model).Result);
        }

        [HttpPost]
        public JsonResult Departments()
        {
            return Json(_question.Departments());
        }

        [HttpPost]
        public async Task<JsonResult> AllReport(int page, int size)
        {
            if (page <= 0) page = 1;

            var result = _question.Retrives();
            var data = await PaginatedList<QuestionRetriveViewModel>.CreateAsync(result.AsQueryable(), page, size);
            var dlen = result.Count();

            return Json(new { data, dlen });
        }

        [HttpGet]
        public IActionResult ViewReport(Guid id)
        {
            Question result = _question.GetReportById(id);

            if(result == null)
            {
                return RedirectToAction("AccessDenied", "Home");
            }

            return View(result);
        }

        [HttpGet]
        public IActionResult Department(string id)
        {
            if(id == null)
            {
                return RedirectToAction("AccessDenied", "Home");
            }

            ViewBag.Id = id;

            return View();
        }

        [HttpPost]
        public async Task<JsonResult> GetReportByDepartment(int page, int size, string id)
        {
            var result = _question.GetReportByDepartment(id);
            var data = await PaginatedList<QuestionRetriveViewModel>.CreateAsync(result.AsQueryable(), page, size);

            var department = _question.GetDepartmentById(id).Result;

            if (page <= 0) page = 1;

            return Json(new {data, department, dlen = result.Count() });
        }

        [HttpPost, Authorize]
        public JsonResult RResponse(Guid id, Guid answerId, string answerText)
        {
            var reult = _question.Response(id, answerId, answerText, User);
            return Json(reult.Result);
        }

        [HttpPost]
        public JsonResult GetResponseByReportId(Guid id)
        {
            var result = _question.GetResponseByReportId(id);
            bool show = false ;
            if(_userManager.GetUserId(User) != null) { show = true ; }

            return Json(new { result, show });
        }

        [HttpPost, Authorize]
        public JsonResult DeleteResponse(Guid id)
        {
            var result = _question.DeleteResponse(id, User);
            return Json(result.Result);
        }

        [HttpPost]
        public JsonResult GetResponseById(Guid id)
        {
            var reult = _question.GetResponseById(id);
            return Json(reult);
        }

        [HttpPost]
        public async Task<JsonResult> UserReport(string id, int page, int size)
        {
            if (page <= 0) page = 1;

            string current = id ?? _userManager.GetUserId(User);
            var user = await _userManager.FindByIdAsync(current);

            if (user == null)
            {
                current = _userManager.GetUserId(User);
                user = await _userManager.FindByIdAsync(current);
            }

            var role = await _userManager.GetRolesAsync(user);

            var result = _question.RetrivesUserReport(role);
            var data = await PaginatedList<QuestionRetriveViewModel>.CreateAsync(result.AsQueryable(), page, size);
            var dlen = result.Count();

            return Json(new { data, dlen });
        }

        [HttpPost]
        public JsonResult ApproveReport(Guid id)
        {
            var reult = _question.ApproveReport(id, User);
            return Json(reult.Result);
        }

        [Authorize(Roles = "Administrator")]
        public IActionResult GetReports()
        {
            return View();
        }

        [HttpPost, Authorize(Roles = "Administrator")]
        public JsonResult GetAllReport()
        {
            return Json(new { data = _question.GetAllReport().Result } );
        }

        [HttpPost, Authorize(Roles = "Administrator")]
        public JsonResult ToggleStatus(Guid id)
        {
            return Json(_question.ToggleStatus(id).Result);
        }

        [HttpPost, Authorize(Roles = "Administrator")]
        public JsonResult DeleteReport(Guid id)
        {
            return Json(_question.DeleteReport(id).Result);
        }

    }
}
