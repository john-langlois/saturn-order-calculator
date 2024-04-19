using Microsoft.AspNetCore.Http;

namespace SaturnCalculator.lib.Interfaces;

public interface IOrdersInterface
{
   public Task<Orders> CalculateOrderTotal(IFormFile file);

}