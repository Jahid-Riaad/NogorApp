using Microsoft.AspNetCore.Identity;
using NogorApp.Models;
using NogorApp.Utilities;
using NogorApp.Utilities.ViewModels;
using System.Security.Claims;

namespace NogorApp.Data.Interfaces;

public interface IAccounts
{
    IEnumerable<IdentityRole> AllRole();

    Task<Response> AddRole(RoleViewModel role);

    Task<Response> DeleteRole(string id);

    IEnumerable<ApplicationUser> GetUsers();

    Task<Response> CreateUser(RegisterViewModel model);

    Task<Response> DeleteUser(string id, string current);

    Task<RoleViewModel> UsersInRole(string id);

    Task<List<UserRoleViewModel>> AssignRole(string id);

    Task<Response> AssignRole(List<UserRoleViewModel> model, string roleId);

    ApplicationUser GetUserInfo(string id);

    Task<PasswordVerificationResult> VerifyHash(string id, string password);

    Task<object> EditProfileinfo(ClaimsPrincipal User, string id);

    Task<Response> UpdateProfile(UserViewModel model);
}

