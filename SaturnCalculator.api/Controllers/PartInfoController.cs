using Microsoft.AspNetCore.Mvc;
using SaturnCalculator.lib;
using SaturnCalculator.lib.Interfaces;

namespace SaturnCalculator.api.Controllers;

[ApiController]
public class PartInfoController : ControllerBase
{
    private readonly IPartInfoInterface iDB;

    public PartInfoController(IPartInfoInterface idb)
    {
        this.iDB = idb;
    }

    [HttpPost]
    [Route("[controller]/GetAllPartInfo")]
    public async Task<IEnumerable<PartInfo>> GetAllPartInfo()
    {
        var files = this.Request.Form.Files;

        if (files.Count != 1)
        {
            return new List<PartInfo>();
        }

        var res = await this.iDB.GetAllPartInfo(files[0]);

        return res;
    }
}