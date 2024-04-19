using Microsoft.AspNetCore.Mvc;
using SaturnCalculator.lib;
using SaturnCalculator.lib.Interfaces;

namespace SaturnCalculator.api.Controllers;

[ApiController]
public class OrdersController : ControllerBase
{
    private readonly IOrdersInterface iDB;

    public OrdersController(IOrdersInterface idb)
    {
        this.iDB = idb;
    }

    [HttpPost]
    [Route("[controller]/GetOrdersFromFile")]
    public async Task<Orders> CalculateOrderTotal(){
        var files = this.Request.Form.Files;

        if (files.Count != 1)
        {
            return new Orders();
        }

        var res = await this.iDB.CalculateOrderTotal(files[0]);

        return res;
    }
}