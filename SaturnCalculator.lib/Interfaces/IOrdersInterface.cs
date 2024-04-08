namespace SaturnCalculator.lib.Interfaces;

public interface IOrdersInterface
{
   public Task<Orders> CalculateOrderTotal(string filePath);
}