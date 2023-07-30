using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NogorApp.Data.Interfaces;
using NogorApp.Models;
using NogorApp.Utilities;
using NogorApp.Utilities.ViewModels;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NogorApp.Data.Repositories
{
    public class Accounts : IAccounts
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _hostEnv;
        private readonly IPasswordHasher<ApplicationUser> _passwordHasher;

        public Accounts(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager, ApplicationDbContext context, IWebHostEnvironment hostEnv, IPasswordHasher<ApplicationUser> passwordHasher)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _context = context;
            _hostEnv = hostEnv;
            _passwordHasher = passwordHasher;
        }

        public async Task<Response> AddRole(RoleViewModel role)
        {
            Response _response = new();

            _response.message = "বিভাগ তৈরি করা হয়েছে।";
            _response.status = "success";
            _response.flag = 1;

            IdentityRole identityRole = new() { Name = role.Name };

            try
            {
                if (!String.IsNullOrEmpty(role.Id))
                {
                    var roleUp = await _roleManager.FindByIdAsync(role.Id);

                    if (roleUp == null)
                    {
                        _response.message = "বিভাগটি খুঁজে পাওয়া যায়নি।";
                        _response.status = "error";
                        _response.flag = 0;
                    }
                    else
                    {
                        roleUp.Name = role.Name;
                        await _roleManager.UpdateAsync(roleUp);
                        _response.message = "বিভাগ হালনাগাদ করা হয়েছে।";
                    }
                }
                else
                {
                    IdentityResult result = await _roleManager.CreateAsync(identityRole);
                }
            }
            catch (Exception ex)
            {
                _response.message = ex.Message.ToString();
                _response.status = "error";
                _response.flag = 0;
            }

            return _response;
        }

        public async Task<List<UserRoleViewModel>> AssignRole(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);

            var model = new List<UserRoleViewModel>();

            foreach (var user in _userManager.Users)
            {
                var userRoleViewModel = new UserRoleViewModel
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    Name = user.Name
                };

                if (await _userManager.IsInRoleAsync(user, role.Name))
                {
                    userRoleViewModel.IsSelected = true;
                }
                else
                {
                    userRoleViewModel.IsSelected = false;
                }

                model.Add(userRoleViewModel);
            }

            return model;
        }

        public IEnumerable<IdentityRole> AllRole()
        {
            return _roleManager.Roles;
        }

        public async Task<Response> CreateUser(RegisterViewModel model)
        {
            Response _response = new();

            _response.message = "ইউজার তৈরি করা হয়েছে।";
            _response.status = "success";
            _response.flag = 1;

            if(model.Id != null)
            {
                var user = await _userManager.FindByIdAsync(model.Id);
                var password = _userManager.PasswordHasher.HashPassword(user, model.Password);

                user.Name = model.Name;
                user.PasswordHash = password;

                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    _response.message = "ইউজার হালনাগাদ করা হয়েছে।";
                }
                else
                {
                    _response.message = "ইউজার হালনাগাদ করা যায়নি।";
                    _response.status = "error";
                    _response.flag = 0;
                }
            }
            else
            {
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email, Name = model.Name };
                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    _response.message = "ইউজার তৈরি করা হয়েছে।";
                }
                else
                {
                    _response.message = "ইউজার তৈরি করা যায়নি।";
                    _response.status = "error";
                    _response.flag = 0;
                }
            }

            

            return _response;
        }

        public async Task<Response> DeleteRole(string id)
        {
            Response _response = new();

            _response.message = "বিভাগ ডিলিট করা হয়েছে।";
            _response.status = "success";
            _response.flag = 1;

            try
            {
                var role = await _roleManager.FindByIdAsync(id);

                if (role == null)
                {
                    _response.message = "বিভাগটি খুঁজে পাওয়া যায়নি।";
                    _response.status = "error";
                    _response.flag = 0;
                }
                else
                {
                    await _roleManager.DeleteAsync(role);
                    _response.message = "বিভাগ ডিলিট করা হয়েছে।";
                }
            }
            catch (Exception ex)
            {
                _response.message = ex.Message.ToString();
                _response.status = "error";
                _response.flag = 0;
            }

            return _response;
        }

        public async Task<Response> DeleteUser(string id, string current)
        {
            Response _response = new();

            _response.message = "ইউজার ডিলিট করা হয়েছে।";
            _response.status = "success";
            _response.flag = 1;

            try
            {
                var user = await _userManager.FindByIdAsync(id);

                if (user == null)
                {
                    _response.message = "ইউজার খুঁজে পাওয়া যায়নি।";
                    _response.status = "error";
                    _response.flag = 0;
                }
                else if (current == user.Id)
                {
                    _response.message = "আপনি নিজেকে ডিলিট করতে পারবেন না!";
                    _response.status = "error";
                    _response.flag = 0;
                }
                else
                {

                    var result = await _userManager.DeleteAsync(user);

                }
            }
            catch (Exception ex)
            {
                _response.message = ex.Message.ToString();
                _response.status = "error";
                _response.flag = 0;
            }

            return _response;
        }

        public IEnumerable<ApplicationUser> GetUsers()
        {
            return _userManager.Users;
        }

        public async Task<RoleViewModel> UsersInRole(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);

            var model = new RoleViewModel
            {
                Id = role.Id,
                Name = role.Name
            };

            foreach (var user in _userManager.Users)
            {
                if (await _userManager.IsInRoleAsync(user, role.Name))
                {
                    model.Users.Add(user.Email);
                }
            }

            return model;
        }

        public async Task<Response> AssignRole(List<UserRoleViewModel> model, string roleId)
        {
            Response _response = new();
            _response.flag = 0;

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
                        return _response;
                }
            }

            return _response;
        }

        public ApplicationUser GetUserInfo(string id)
        {
            return _userManager.Users.Where(x => x.Id == id).FirstOrDefault();
        }

        public async Task<PasswordVerificationResult> VerifyHash(string id, string password)
        {
            var user = await _userManager.FindByIdAsync(id);
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            return result;
        }

        public async Task<object> EditProfileinfo(ClaimsPrincipal User, string id)
        {
            if (id == null)
            {
                return new { user = string.Empty, redirect = true };
            }

            string current = _userManager.GetUserId(User);
            var u_current = await _userManager.FindByIdAsync(current);
            var user = await _userManager.FindByIdAsync(id);

            if (id != current)
            {
                int t = 0;
                var role = await _userManager.GetRolesAsync(u_current);
                for (int i = 0; i < role.Count; i++)
                {
                    if (role[i] == "Administrator")
                    {
                        t++;
                        break;
                    }
                }

                if (t == 0)
                {
                    return new { user = string.Empty, redirect = true };
                }
            }

            return new { user, redirect = false };
        }

        public async Task<Response> UpdateProfile(UserViewModel model)
        {
            Response _response = new();

            _response.message = "প্রোফাইল আপডেট করা হয়েছে।";
            _response.status  = "success";
            _response.flag    = 1;

            try
            {
                ApplicationUser user = await _userManager.FindByIdAsync(model.Id);

                if(user == null)
                {
                    _response.message = "এই ইউজার খুঁজে পাওয়া যায়নি।";
                    _response.status  = "error";
                    _response.flag    = 0;
                }
                else
                {
                    if (!string.IsNullOrEmpty(model.Password))
                    {
                        user.PasswordHash = _passwordHasher.HashPassword(user, model.Password);
                    }

                    if(model.ProfilePicture != null)
                    {
                        if(user.ProfilePicture != null)
                        {
                            var fdel = Path.Combine(_hostEnv.WebRootPath, user.ProfilePicture);
                            if (File.Exists(fdel))
                            {
                                GC.Collect();
                                GC.WaitForPendingFinalizers();
                                File.Delete(fdel);
                            }
                        }

                        var ext = Path.GetExtension(model.ProfilePicture.FileName);
                        string filename = DateTime.Now.ToString("yyMMdd-profile-") + Guid.NewGuid().ToString() + ext;
                        string newFilePath = Path.Combine("profile", filename);
                        string path = Path.Combine(_hostEnv.WebRootPath, newFilePath);
                        model.ProfilePicture.CopyTo(new FileStream(path, FileMode.Create));
                        user.ProfilePicture = newFilePath;
                    }

                    user.Id = model.Id;
                    user.Name = model.Name;
                    user.Designation = model.Designation;
                    user.About = model.About;
                    user.FLink = model.FLink;
                    user.TLink = model.TLink;
                    user.LLink = model.LLink;

                    _context.Update(user);
                    await _context.SaveChangesAsync();
                }
                
            }
            catch (Exception ex)
            {
                _response.message = ex.Message.ToString();
                _response.status = "error";
                _response.flag = 0;
            }
            

            return _response;
        }
    }
}
