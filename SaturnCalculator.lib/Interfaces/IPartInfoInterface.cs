using Microsoft.AspNetCore.Http;

namespace SaturnCalculator.lib.Interfaces;

public interface IPartInfoInterface
{
   public Task<IEnumerable<PartInfo>> GetAllPartInfo(IFormFile file);
}