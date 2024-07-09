using Microsoft.AspNetCore.Mvc;
using SaturnCalculator.entity;
using SaturnCalculator.entity.Models;
using SaturnCalculator.lib;
using SaturnCalculator.lib.Interfaces;

namespace SaturnCalculator.api.Controllers;

[ApiController]
public class EmailController : ControllerBase
{
    private readonly IEmailService iDB;

    public EmailController(IEmailService idb)
    {
        this.iDB = idb;
    }

    [HttpPost]
    [Route("[controller]/SendEmail")]
    public async Task<int> SendEmail([FromForm] Email email)
    {
        return await this.iDB.SendConfirmationEmail(email);
    }

}