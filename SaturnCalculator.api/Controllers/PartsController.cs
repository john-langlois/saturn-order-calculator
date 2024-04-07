using Microsoft.AspNetCore.Mvc;
using SaturnCalculator.lib;
using SaturnCalculator.lib.Interfaces;

namespace SaturnCalculator.api.Controllers;

[ApiController]
public class PartsController : ControllerBase
{
    private readonly IPartsInterface iDB;

    public PartsController(IPartsInterface idb)
    {
        this.iDB = idb;
    }

    [HttpGet]
    [Route("[controller]/SendConfirmationEmail/{filePath}")]
    public async Task<IEnumerable<Part>> GetPartsFromExcel(string filePath) => await this.iDB.GetPartsFromSheet(filePath);
}