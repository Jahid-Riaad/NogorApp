using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NogorApp.Data.Interfaces;
using NogorApp.Models;
using NogorApp.Utilities;
using NogorApp.Utilities.ViewModels;
using System.Security.Claims;

namespace NogorApp.Data.Repositories
{
    public class QuestionRepository : IQuestion
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IWebHostEnvironment _hostEnv;
        private readonly ApplicationDbContext _context;

        public QuestionRepository(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IWebHostEnvironment hostEnv, ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _hostEnv = hostEnv;
            _context = context;
        }

        public async Task<Response> AddReport(QuestionViewModel model)
        {
            Response _response = new();

            _response.message = "আপনার অভিযোগটি সফল ভাবে পাঠানো হয়েছে।";
            _response.status = "success";
            _response.flag = 1;

            try
            {
                string FilesPath = "";

                if (model.Files != null)
                {
                    foreach (IFormFile item in model.Files)
                    {
                        var ext = Path.GetExtension(item.FileName);
                        string filename = DateTime.Now.ToString("yyMMdd-") + Guid.NewGuid().ToString() + ext;
                        string newFilePath = Path.Combine("uploads", filename);
                        string path = Path.Combine(_hostEnv.WebRootPath, newFilePath);
                        item.CopyTo(new FileStream(path, FileMode.Create));

                        FilesPath += newFilePath + ";";
                    }

                }

                Question question = new Question();
                question.Title = model.Title;
                question.Name = model.Name;
                question.Phone = model.Phone;
                question.Email = model.Email;
                question.Department = model.Department;
                question.Body = model.Body;
                question.Attachments = FilesPath;
                question.AskedOn = DateTime.Now;
                question.Status = 0;

                _context.Add(question);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _response.message = ex.Message.ToString();
                _response.status = "error";
                _response.flag = 0;
            }

            return _response;
        }

        public async Task<Response> ApproveReport(Guid id, ClaimsPrincipal user)
        {
            Response _response = new();

            _response.message = "রিপোর্ট এপ্রুভ করা হয়েছে।";
            _response.status = "success";
            _response.flag = 1;

            try
            {
                if (id != Guid.Empty)
                {
                    Question question = _context.Questions.Where(_ => _.Id == id).FirstOrDefault();
                    if (question == null)
                    {
                        _response.message = "রিপোর্ট খুঁজে পাওয়া যায়নি।";
                        _response.status = "error";
                        _response.flag = 0;
                    }
                    else
                    {
                        var role = await _userManager.GetRolesAsync(await _userManager.GetUserAsync(user));
                        List<string> roleId = new List<string>();

                        for (int i = 0; i < role.Count(); i++)
                        {
                            roleId.Add(_roleManager.Roles.Where(_ => _.Name == role[i]).FirstOrDefault().Id);
                        }

                        if (!roleId.Contains(question.Department))
                        {
                            int t = 0;

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
                                _response.message = "আপানার এই রিপোর্ট এপ্রুভ করার অনুমতি নেই।";
                                _response.status = "error";
                                _response.flag = 0;
                            }
                            else
                            {
                                question.Status = 1;

                                _context.Questions.Update(question);
                                await _context.SaveChangesAsync();
                            }
                        }
                        else
                        {
                            question.Status = 1;

                            _context.Questions.Update(question);
                            await _context.SaveChangesAsync();
                        }
                    }
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

        public async Task<Response> DeleteReport(Guid id)
        {
            Response _response = new();

            _response.message = "রিপোর্ট ডিলিট করা হয়েছে।";
            _response.status = "success";
            _response.flag = 1;

            try
            {
                if (id != Guid.Empty)
                {
                    Question question = _context.Questions.Where(_ => _.Id == id).FirstOrDefault();
                    if (question == null)
                    {
                        _response.message = "রিপোর্টটি খুঁজে পাওয়া যায়নি।";
                        _response.status = "error";
                        _response.flag = 0;
                    }
                    else
                    {
                        var attachments = question.Attachments.Split(';');
                        foreach (var attachment in attachments)
                        {
                            var fdel = Path.Combine(_hostEnv.WebRootPath, attachment);
                            if (File.Exists(fdel))
                            {
                                GC.Collect();
                                GC.WaitForPendingFinalizers();
                                File.Delete(fdel);
                            }
                        }

                        _context.Questions.Remove(question);
                        await _context.SaveChangesAsync();

                    }

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

        public async Task<Response> DeleteResponse(Guid id, ClaimsPrincipal user)
        {
            Response _response = new();

            _response.message = "আপনার প্রতিউত্তর ডিলিট করা হয়েছে।";
            _response.status = "success";
            _response.flag = 1;

            try
            {
                var answer = await _context.Answers.Where(x => x.Id == id).FirstOrDefaultAsync();

                if (answer == null)
                {
                    _response.message = "অভিযোগটি খুঁজে পাওয়া যায়নি।";
                    _response.status = "error";
                    _response.flag = 0;
                }
                else if(answer.AnswererId != _userManager.GetUserId(user))
                {
                    int t = 0;
                    var role = await _userManager.GetRolesAsync(await _userManager.GetUserAsync(user));
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
                        _response.message = "আপানার এটি ডিলিট করার অনুমতি নেই।";
                        _response.status = "error";
                        _response.flag = 0;
                    }
                }
                else
                {
                    _context.Answers.Remove(answer);
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

        public IEnumerable<IdentityRole> Departments()
        {
            return _roleManager.Roles;
        }

        public async Task<List<Question>> GetAllReport()
        {
            return await _context.Questions.OrderByDescending(_=>_.AskedOn).ToListAsync();
        }

        public async Task<IdentityRole> GetDepartmentById(string id)
        {
            return await _roleManager.FindByIdAsync(id);
        }

        public IQueryable<QuestionRetriveViewModel> GetReportByDepartment(string id)
        {
            return (from q in _context.Questions
                    join d in _roleManager.Roles
                    on q.Department equals d.Id
                    where q.Department == id && q.Status == 1
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
        }

        public Question GetReportById(Guid id)
        {
            Question question = _context.Questions.Where(x => x.Id == id).FirstOrDefault();
            if(question == null)
            {
                return null;
            }
            IdentityRole role = _roleManager.Roles.Where(x => x.Id == question.Department).FirstOrDefault();
            question.Department += ", "+ role.Name;
            return question;
        }

        public Answer GetResponseById(Guid id)
        {
            return _context.Answers.Where(_ => _.Id == id).FirstOrDefault();    
        }

        public List<ResponseRetriveViewModel> GetResponseByReportId(Guid id)
        {
            return _context.Answers.Where(x => x.QuestionId == id).OrderByDescending(x => x.AnswredOn).Select(x => new ResponseRetriveViewModel
            {
                Id = x.Id,
                Name = _userManager.FindByIdAsync(x.AnswererId).Result.Name,
                ResponsedOn = x.AnswredOn.ToString("MMMM dd, yyyy")+" at "+ x.AnswredOn.ToString("hh:mm tt"),
                ProfilePicture = _userManager.FindByIdAsync(x.AnswererId).Result.ProfilePicture,
                Body = x.AnswerText
            }).ToList();
        }

        public async Task<Response> Response(Guid id, Guid answerId, string answerText, ClaimsPrincipal user)
        {
            Response _response = new();

            _response.message = "আপনার প্রতিউত্তর যোগ করা হয়েছে।";
            _response.status = "success";
            _response.flag = 1;

            try
            {
                if(answerId != Guid.Empty)
                {
                    Answer answer = _context.Answers.Where(_ => _.Id == answerId).FirstOrDefault();
                    if(answer == null)
                    {
                        _response.message = "প্রতিউত্তরটি খুঁজে পাওয়া যায়নি।";
                        _response.status = "error";
                        _response.flag = 0;
                    }
                    else
                    {
                        answer.AnswerText = answerText;
                        _context.Answers.Update(answer);
                        await _context.SaveChangesAsync();

                        _response.message = "আপনার প্রতিউত্তর আপডেট করা হয়েছে।";
                        _response.status = "success";
                        _response.flag = 1;
                    }

                }
                else
                {
                    Question question = await _context.Questions.Where(x => x.Id == id).FirstOrDefaultAsync();

                    if (question == null)
                    {
                        _response.message = "অভিযোগটি খুঁজে পাওয়া যায়নি।";
                        _response.status = "error";
                        _response.flag = 0;
                    }
                    else
                    {
                        int t = 0;
                        var role = await _userManager.GetRolesAsync(await _userManager.GetUserAsync(user));
                        for (int i = 0; i < role.Count; i++)
                        {
                            if (role[i] == _roleManager.Roles.Where(_=>_.Id == question.Department).FirstOrDefault().Name)
                            {
                                t++;
                                break;
                            }
                            else if (role[i] == "Administrator")
                            {
                                t++;
                                break;
                            }
                        }

                        if (t == 0)
                        {
                            _response.message = "আপানার এই রিপোর্টে রেসপন্স করার অনুমতি নেই।";
                            _response.status = "error";
                            _response.flag = 0;
                        }
                        else
                        {
                            Answer answer = new();
                            answer.QuestionId = question.Id;
                            answer.AnswererId = _userManager.GetUserId(user);
                            answer.AnswredOn = DateTime.Now;
                            answer.AnswerText = answerText;

                            _context.Add(answer);
                            await _context.SaveChangesAsync();
                        }
                    }
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

        public IQueryable<QuestionRetriveViewModel> Retrives()
        {   
            return (from q in _context.Questions
                    join d in _roleManager.Roles
                    on q.Department equals d.Id
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
        }

        public IQueryable<QuestionRetriveViewModel> RetrivesUserReport(IList<string> role)
        {
            List<string> roleId = new List<string>();
            for (int i = 0; i < role.Count(); i++)
            {
                roleId.Add(_roleManager.Roles.Where(_=>_.Name == role[i]).FirstOrDefault().Id);
            }

            return (from q in _context.Questions
                    join d in _roleManager.Roles
                    on q.Department equals d.Id
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
                    }).Where(_ => roleId.Contains(_.DepartmentId)).OrderByDescending(q => q.AskedOn);
        }

        public async Task<Response> ToggleStatus(Guid id)
        {
            Response _response = new();

            _response.message = "রিপোর্ট এপ্রুভ করা হয়েছে।";
            _response.status = "success";
            _response.flag = 1;

            try
            {
                if (id != Guid.Empty)
                {
                    Question question = _context.Questions.Where(_ => _.Id == id).FirstOrDefault();
                    if (question == null)
                    {
                        _response.message = "রিপোর্টটি খুঁজে পাওয়া যায়নি।";
                        _response.status = "error";
                        _response.flag = 0;
                    }
                    else
                    {
                        if(question.Status == 1)
                        {
                            question.Status = 0;

                            _response.message = "রিপোর্ট আন-এপ্রুভ করা হয়েছে।";
                            _response.status = "success";
                            _response.flag = 1;
                        }
                        else
                        {
                            question.Status = 1;
                        }

                        _context.Questions.Update(question);
                        await _context.SaveChangesAsync();

                    }

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
