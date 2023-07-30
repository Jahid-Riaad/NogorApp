using Microsoft.AspNetCore.Identity;
using NogorApp.Models;
using NogorApp.Utilities;
using NogorApp.Utilities.ViewModels;
using System.Security.Claims;

namespace NogorApp.Data.Interfaces
{
    public interface IQuestion
    {
        IEnumerable<IdentityRole> Departments();

        Task<Response> AddReport(QuestionViewModel model);

        IQueryable<QuestionRetriveViewModel> Retrives();

        Question GetReportById(Guid id);

        IQueryable<QuestionRetriveViewModel> GetReportByDepartment(string id);

        Task<IdentityRole> GetDepartmentById(string id);

        Task<Response> Response(Guid id, Guid answerId, string answerText, ClaimsPrincipal user);

        List<ResponseRetriveViewModel> GetResponseByReportId(Guid id);

        Task<Response> DeleteResponse(Guid id, ClaimsPrincipal user);

        Answer GetResponseById(Guid id);

        IQueryable<QuestionRetriveViewModel> RetrivesUserReport(IList<string> role);

        Task<Response> ApproveReport(Guid id, ClaimsPrincipal user);

        Task<List<Question>> GetAllReport();

        Task<Response> ToggleStatus(Guid id);

        Task<Response> DeleteReport(Guid id);
    }
}
