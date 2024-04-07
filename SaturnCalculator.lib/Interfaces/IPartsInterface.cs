namespace SaturnCalculator.lib.Interfaces;

public interface IPartsInterface
{
   public Task<IEnumerable<Part>> GetPartsFromSheet(string filePath);
}