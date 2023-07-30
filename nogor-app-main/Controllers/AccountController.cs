using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NogorApp.Data.Interfaces;
using NogorApp.Models;
using NogorApp.Utilities;
using NogorApp.Utilities.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NogorApp.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _hostEnv;
        private readonly IAccounts _accounts;
        private readonly ApplicationDbContext _context;

        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, RoleManager<IdentityRole> roleManager, IWebHostEnvironment hostEnv, IAccounts accounts, ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _hostEnv = hostEnv;
            _accounts = accounts;
            _context = context;
        }

        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        [HttpGet, Authorize(Roles = "Administrator")]
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Role()
        {
            return View();
        }

        [HttpGet, Authorize(Roles = "Administrator")]
        public JsonResult AllRole()
        {
            return Json(new { data = _accounts.AllRole() });
        }

        [HttpPost, Authorize(Roles = "Administrator")]
        public JsonResult AddRole(RoleViewModel role)
        {
            var result = _accounts.AddRole(role);
            return Json(result.Result);
        }

        [HttpPost, Authorize(Roles = "Administrator")]
        public JsonResult DeleteRole(string id)
        {
            var result = _accounts.DeleteRole(id);
            return Json(result.Result);
        }

        [HttpGet, Authorize(Roles = "Administrator")]
        public IActionResult UsersInRole(string id)
        {
            var result = _accounts.UsersInRole(id);
            return View(result.Result);
        }

        [HttpGet, Authorize(Roles = "Administrator")]
        public IActionResult AssignRole(string id)
        {
            ViewBag.roleId = id;
            return View(_accounts.AssignRole(id).Result);
        }

        [HttpPost, Authorize(Roles = "Administrator")]
        public async Task<IActionResult> AssignRole(List<UserRoleViewModel> model, string roleId)
        {
            ViewBag.roleId = roleId;
            //_accounts.AssignRole(model, roleId);

            IdentityRole role = await _roleManager.FindByIdAsync(roleId);

            for (int i = 0; i < model.Count; i++)
            {
                ApplicationUser user = await _userManager.FindByIdAsync(model[i].UserId);

                IdentityResult result;

                if (model[i].IsSelected && !(await _userManager.IsInRoleAsync(user, role.Name)))
                {
                    result = await _userManager.AddToRoleAsync(user, role.Name);
                }
                else if (!model[i].IsSelected && await _userManager.IsInRoleAsync(user, role.Name))
                {
                    result = await _userManager.RemoveFromRoleAsync(user, role.Name);
                }
                else
                {
                    continue;
                }

                if (result.Succeeded)
                {
                    if (i < (model.Count - 1))
                        continue;
                    else
                        return RedirectToAction("UsersInRole", new { id = roleId });
                }
            }

            //return _response;

            return RedirectToAction("UsersInRole", new { id = roleId });
        }

        [AcceptVerbs("Get", "Post"), Authorize(Roles = "Administrator")]
        public async Task<IActionResult> IsEmailInUse(string email)
        {
            var result = await _userManager.FindByEmailAsync(email);

            if (result == null)
            {
                return Json(true);
            }
            else
            {
                return Json($"ইমেলটি ইতিপূর্বেই রেজিস্টার করা হয়েছে।");
            }
        }

        [HttpGet, Authorize(Roles = "Administrator")]
        public JsonResult GetUser()
        {
            return Json(new { data = _accounts.GetUsers() });
        }

        [HttpPost, Authorize(Roles = "Administrator")]
        public JsonResult CreateUser(RegisterViewModel model)
        {
            var result = _accounts.CreateUser(model);
            return Json(result.Result);
        }

        [HttpPost, Authorize(Roles = "Administrator")]
        public JsonResult DeleteUser(string id)
        {
            string current = _userManager.GetUserId(User);
            var result = _accounts.DeleteUser(id, current);
            return Json(result.Result);
        }

        [AllowAnonymous, ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Login");
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Login()
        {
            if (_signInManager.IsSignedIn(User))
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<JsonResult> Login(string email, string password, bool rememberMe)
        {
            Response _response = new();
            _response.message = "অবৈধ প্রচেষ্টা!";
            _response.status = "error";
            _response.flag = 0;

            ApplicationUser user = await _userManager.FindByEmailAsync(email);

            if (user != null)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var hasAnyRole = roles.Count > 0;

                if (hasAnyRole == false)
                {
                    _response.message = "আপনার লগিন করার অনুমতি নেই।";
                    _response.status = "error";
                    _response.flag = 0;
                }
                else
                {
                    var result = await _signInManager.PasswordSignInAsync(email, password, rememberMe, false);

                    if (result.Succeeded)
                    {
                        _response.message = "আপনি সফল ভাবে লগিন করেছেন।";
                        _response.status = "success";
                        _response.flag = 1;
                    }
                }
            }
            else
            {
                _response.message = "আপানার তথ্যগুলো সঠিক নয়।";
                _response.status = "error";
                _response.flag = 0;
            }

            return Json(_response);
        }

        [HttpGet, AllowAnonymous]
        public IActionResult ResetPassword(string token, string email)
        {
            if (token == null || email == null)
            {
                ModelState.AddModelError("", "");
            }

            return View();
        }

        public IActionResult Profile()
        {
            return View();
        }

        [HttpGet]
        public async Task<JsonResult> GetUserInfo(string id)
        {
            string current = id ?? _userManager.GetUserId(User);
            var user = await _userManager.FindByIdAsync(current);

            if(user == null)
            {
                current = _userManager.GetUserId(User);
                user = await _userManager.FindByIdAsync(current);
            }

            var role = await _userManager.GetRolesAsync(user);
            string joined = string.Join(", ", role);

            bool showEdit = User != null;

            int totalreport = 0;
            for(int i = 0; i < role.Count; i++)
            {
                string rid = _roleManager.Roles.Where(_ => _.Name == role[i]).FirstOrDefault().Id;
                totalreport += _context.Questions.Where(_ => _.Department == rid).Count();
            }

            int responded = _context.Answers.Where(_ => _.AnswererId == user.Id).Count();

            return Json(new { user = _accounts.GetUserInfo(current), department = joined, showEdit, totalreport, responded });
        }

        [HttpGet]
        public async Task<IActionResult> EditProfile(string id)
        {
            ViewBag.Id = id;

            if (id != _userManager.GetUserId(User))
            {
                var u_role = await _userManager.GetRolesAsync(await _userManager.FindByIdAsync(_userManager.GetUserId(User)));
                int r = 0;
                for (int i = 0; i < u_role.Count; i++)
                {
                    if (u_role[i] == "Administrator")
                    {
                        r++;
                        break;
                    }
                }

                if(r == 0)
                {
                    return RedirectToAction(nameof(AccessDenied));
                }
            }

            return View();
        }

        [HttpGet]
        public JsonResult EditProfileinfo(string id)
        {
            return base.Json(_accounts.EditProfileinfo(User, id).Result);
        }

        [AcceptVerbs("Get", "Post")]
        public async Task<JsonResult> IsPasswordCorrect(string id, string current_password)
        {
            var user = await _userManager.FindByIdAsync(id);
            var result = _accounts.VerifyHash(id, current_password).Result;

            if (result != 0)
            {
                return Json(true);
            }
            else
            {
                return Json($"আপানার পাসওয়ার্ডটি সঠিক নয়!");
            }
        }

        [HttpPost]
        public JsonResult UpdateProfile(UserViewModel model)
        {
            return Json(_accounts.UpdateProfile(model).Result);
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
