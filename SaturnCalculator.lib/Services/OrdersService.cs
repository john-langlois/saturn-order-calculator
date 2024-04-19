using ClosedXML.Excel;
using DocumentFormat.OpenXml.Drawing.Charts;
using Microsoft.AspNetCore.Http;
using SaturnCalculator.lib.Interfaces;
using Microsoft.Extensions.Options;
using SaturnCalculator.lib.Models;

namespace SaturnCalculator.lib.Services;

public class OrdersService: IOrdersInterface
{
    private readonly IOptionsMonitor<AppSettings> options;
    private readonly IPartsInterface parts;
    private readonly IPartInfoInterface partInfo;

    public OrdersService(IOptionsMonitor<AppSettings> options, IPartsInterface parts, IPartInfoInterface partInfo)
    {
        this.options = options;
        this.parts = parts;
        this.partInfo = partInfo;
    }
    public async Task<Orders> CalculateOrderTotal(IFormFile file)
    {
        Orders Orders = new Orders();
        
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
                    return Orders;
                }

                var range = worksheet.RangeUsed();
                
                Orders.TradingPartner = range.Cell("B1").Value.ToString();
                Orders.PONumber = range.Cell("B2").Value.ToString();
                Orders.TrailerNumber = range.Cell("B3").Value.ToString();
                Orders.BillLandingNo = range.Cell("B4").Value.ToString();
                Orders.TrackingNo = range.Cell("B5").Value.ToString();
                Orders.ShipToCode = range.Cell("B6").Value.ToString();
                
                Orders.CarrierCode = range.Cell("D1").Value.ToString();
                Orders.ShipDate = range.Cell("D2").Value.ToString();
                Orders.ShipTime = range.Cell("D3").Value.ToString();
                Orders.Weight = range.Cell("D4").Value.ToString();
                Orders.PackageType = range.Cell("D5").Value.ToString();
                Orders.TotalPackageCount = range.Cell("D6").Value.ToString();

                IEnumerable<Part> allParts = await parts.GetPartsFromSheet(file);
                IEnumerable<PartInfo> allPartInfo = await partInfo.GetAllPartInfo(file);
                List<CalculatedLineItems> lineItems = new List<CalculatedLineItems>();
                List<CalculatedVendorItem> vendorItems = new List<CalculatedVendorItem>();
                
                var distinctArray = allParts.GroupBy(elem=>elem.VendorItemNumber).Select(group=>group.First()).ToList();
                
                PartInfo singlePartInfo;
                foreach (var item in allParts)
                {
                    CalculatedLineItems lineItem = new CalculatedLineItems();
                    singlePartInfo = allPartInfo.First(x => x.VendorItemNumber == item.VendorItemNumber);
                    lineItem.VendorItemNumber = item.VendorItemNumber;
                    lineItem.SerialNo = item.SerialNo;
                    lineItem.ShippedQuantity = item.ShippedQuantity;
                    lineItem.ItemCost = singlePartInfo.ItemCost;
                    lineItem.TotalCost = int.Parse(singlePartInfo.ItemCost) * int.Parse(item.ShippedQuantity);
                    lineItems.Add(lineItem);
                    Orders.OrderCost += lineItem.TotalCost;
                    Orders.OrderQuantity += int.Parse(lineItem.ShippedQuantity);
                    
                }
                Orders.LineItems = lineItems;
                
                
                foreach (var item in distinctArray)
                { 
                    CalculatedVendorItem vendorPart = new CalculatedVendorItem(); 
                    var commonParts = lineItems.Where(x => x.VendorItemNumber == item.VendorItemNumber);
                    vendorPart.VendorItemNumber = item.VendorItemNumber;
                    
                   //Get total cost and quantity for grouped vendor item parts
                   foreach (var part in commonParts)
                   {
                       vendorPart.TotalCost += part.TotalCost;
                       vendorPart.TotalQuantity += int.Parse(part.ShippedQuantity);
                   }
                   vendorItems.Add(vendorPart);
                }

                Orders.VendorItems = vendorItems;


            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error parsing Excel file: {ex.Message}");
        }

        return Orders;
    }
}