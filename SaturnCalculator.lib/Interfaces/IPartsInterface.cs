using Microsoft.AspNetCore.Http;

namespace SaturnCalculator.lib.Interfaces;

public interface IPartsInterface
{
   public Task<IEnumerable<Part>> GetPartsFromSheet(IFormFile file);
}