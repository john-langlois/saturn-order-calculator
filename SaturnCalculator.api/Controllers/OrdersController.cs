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

    [HttpGet]
    [Route("[controller]/GetOrdersFromFile")]
    public async Task<Orders> CalculateOrderTotal(string filePath) => await this.iDB.CalculateOrderTotal(filePath);
}