using Microsoft.AspNetCore.Mvc;
using SaturnCalculator.entity.Models;
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

    [HttpPost]
    [Route("[controller]/UpsertOrderInfo")]
    public async Task<int> UpsertOrderInfo(OrderInfo item) => await this.iDB.UpsertOrderInfo(item);

    [HttpGet]
    [Route("[controller]/GetAllOrderInfo")]
    public async Task<IEnumerable<OrderInfo>> GetAllOrderInfo() => await this.iDB.GetAllOrderInfo();
    
    [HttpPost]
    [Route("[controller]/UpsertOrder")]
    public async Task<int> UpsertOrder(Orders item) => await this.iDB.UpsertOrder(item);

    [HttpGet]
    [Route("[controller]/GetAllOrders")]
    public async Task<IEnumerable<Orders>> GetAllOrders() => await this.iDB.GetAllOrders();
    
    [HttpGet]
    [Route("[controller]/GetOrdersByID/{id}")]
    public async Task<Orders> GetOrdersByID(int id) => await this.iDB.GetOrdersByID(id);
}