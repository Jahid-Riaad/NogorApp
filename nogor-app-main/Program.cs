using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NogorApp.Data.Interfaces;
using NogorApp.Data.Repositories;
using NogorApp.Models;

var builder = WebApplication.CreateBuilder(args);

#region Services

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>().AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddTransient<IAccounts, Accounts>();

builder.Services.AddTransient<IQuestion, QuestionRepository>();

// Add services to the container.
builder.Services.AddRazorPages();


#endregion

var app = builder.Build();

#region ConfigureApp

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");
    endpoints.MapRazorPages();
});

#endregion

app.Run();
