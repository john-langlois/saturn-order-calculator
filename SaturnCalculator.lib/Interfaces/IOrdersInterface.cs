using Microsoft.AspNetCore.Http;
using SaturnCalculator.entity.Models;

namespace SaturnCalculator.lib.Interfaces { 

public interface IOrdersInterface
{
    public Task<Orders> CalculateOrderTotal(IFormFile file);

    public Task<IEnumerable<OrderInfo>> GetAllOrderInfo();
    public Task<int> UpsertOrderInfo(OrderInfo ins);
    
    public Task<int> UpsertOrder(Orders ins);
    public Task<IEnumerable<Orders>> GetAllOrders();
    public Task<Orders> GetOrdersByID(int orderID);


    } 
}