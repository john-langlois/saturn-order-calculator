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
    public async Task<IEnumerable<PartInfo>> GetAllPartInfo(string filePath) => await this.iDB.GetAllPartInfo(filePath);
}