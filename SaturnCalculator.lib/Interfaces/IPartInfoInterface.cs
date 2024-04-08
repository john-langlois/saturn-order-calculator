namespace SaturnCalculator.lib.Interfaces;

public interface IPartInfoInterface
{
   public Task<IEnumerable<PartInfo>> GetAllPartInfo(string filePath);
}