using ClosedXML.Excel;
using SaturnCalculator.lib.Interfaces;
using Microsoft.Extensions.Options;
using OfficeOpenXml;
using SaturnCalculator.lib.Models;

namespace SaturnCalculator.lib.Services;

public class PartInfoService: IPartInfoInterface
{
    private readonly IOptionsMonitor<AppSettings> options;

    public PartInfoService(IOptionsMonitor<AppSettings> options)
    {
        this.options = options;
    }
    public async Task<IEnumerable<PartInfo>> GetAllPartInfo(string filePath)
    {
        List<PartInfo> partInfo = new List<PartInfo>();
        
        try
        {
            using (var workbook = new XLWorkbook(filePath))
            {
                var worksheet = workbook.Worksheet(2); // Assuming the first worksheet

                if (worksheet == null)
                {
                    Console.WriteLine("Worksheet is null. Check if the Excel file contains any data.");
                    return partInfo;
                }

                var range = worksheet.RangeUsed();
                for (int row = 2; row <= range.RowCount(); row++)
                {
                    PartInfo item = new PartInfo();
                    item.SerialNo = range.Cell(row, 3).Value.ToString();
                    item.VendorItemNumber = range.Cell(row, 1).Value.ToString();
                    item.ItemCost = range.Cell(row, 2).Value.ToString();
                    
                    partInfo.Add(item);
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error parsing Excel file: {ex.Message}");
        }

        return partInfo;
    }

}