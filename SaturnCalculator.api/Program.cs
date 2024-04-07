using System.Reflection;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.Extensions.Options;
using SaturnCalculator.lib.Interfaces;
using SaturnCalculator.lib.Models;
using SaturnCalculator.lib.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("ConnectionStrings"));
builder.Services.AddSingleton<IPartsInterface, PartService>(x => new PartService(x.GetRequiredService<IOptionsMonitor<AppSettings>>()));



builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddDefaultPolicy(builder => {
    builder.AllowAnyMethod().AllowAnyHeader().SetIsOriginAllowed(origin => true).AllowCredentials();
}));
builder.Services.AddAuthentication(IISDefaults.AuthenticationScheme);
builder.Services.AddControllers();
var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseDeveloperExceptionPage();
app.UseSwagger();

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SaturnCalculator.api v1"));

}
else
{
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/SaturnCalculator.api/swagger/v1/swagger.json", "backend.api v1"));
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    try
    {
        endpoints.MapControllers();
    }
    catch (ReflectionTypeLoadException ex)
    {
        foreach (Exception inner in ex.LoaderExceptions)
        {
        }
    }
});

app.Run();