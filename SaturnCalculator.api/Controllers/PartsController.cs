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

    [HttpPost]
    [Route("[controller]/GetPartsFromFile")]
    public async Task<IEnumerable<Part>> GetPartsFromExcel(){
        var files = this.Request.Form.Files;

        if (files.Count != 1)
        {
            return new List<Part>();
        }

        var res = await this.iDB.GetPartsFromSheet(files[0]);

        return res;
    }
}