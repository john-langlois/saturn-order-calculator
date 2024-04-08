using ClosedXML.Excel;
using DocumentFormat.OpenXml.Drawing.Charts;
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
    public async Task<Orders> CalculateOrderTotal(string filePath)
    {
        Orders Orders = new Orders();
        
        try
        {
            using (var workbook = new XLWorkbook(filePath))
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

                IEnumerable<Part> allParts = await parts.GetPartsFromSheet(filePath);
                IEnumerable<PartInfo> allPartInfo = await partInfo.GetAllPartInfo(filePath);
                List<CalculatedLineItems> lineItems = new List<CalculatedLineItems>();

                PartInfo singlePartInfo;
                foreach (var item in allParts)
                {
                    CalculatedLineItems lineItem = new CalculatedLineItems();
                    singlePartInfo = allPartInfo.Where(x => x.SerialNo == item.SerialNo).First();
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
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error parsing Excel file: {ex.Message}");
        }

        return Orders;
    }

}