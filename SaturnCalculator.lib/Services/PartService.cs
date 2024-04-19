using ClosedXML.Excel;
using Microsoft.AspNetCore.Http;
using SaturnCalculator.lib.Interfaces;
using Microsoft.Extensions.Options;
using OfficeOpenXml;
using SaturnCalculator.lib.Models;

namespace SaturnCalculator.lib.Services;

public class PartService: IPartsInterface
{
    private readonly IOptionsMonitor<AppSettings> options;

    public PartService(IOptionsMonitor<AppSettings> options)
    {
        this.options = options;
    }
    public async Task<IEnumerable<Part>> GetPartsFromSheet(IFormFile file)
    {
        List<Part> parts = new List<Part>();
        
        await using var ms = new MemoryStream();

        await file.OpenReadStream().CopyToAsync(ms);
        
        try
        {
            using (var workbook = new XLWorkbook(ms))
            {
                var worksheet = workbook.Worksheet(1); // Assuming the first worksheet

                if (worksheet == null)
                {
                    Console.WriteLine("Worksheet is null. Check if the Excel file contains any data.");
                    return parts;
                }

                var range = worksheet.RangeUsed();

                // Assuming the first row contains headers
                int vendorItemNumberColumnIndex = 1;
                int shippedQuantityColumnIndex = 2;
                int shippedQuantityUOMColumnIndex = 3;
                int serialNoColumnIndex = 4;

                for (int row = 9; row <= range.RowCount(); row++)
                {
                    Part item = new Part();
                    item.SerialNo = range.Cell(row, serialNoColumnIndex).Value.ToString();
                    item.VendorItemNumber = range.Cell(row, vendorItemNumberColumnIndex).Value.ToString();
                    item.ShippedQuantity = range.Cell(row, shippedQuantityColumnIndex).Value.ToString();
                    item.ShippedQuantityUOM = range.Cell(row, shippedQuantityUOMColumnIndex).Value.ToString();
                    
                    parts.Add(item);
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error parsing Excel file: {ex.Message}");
        }

        return parts;
    }

}