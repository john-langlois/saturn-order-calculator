namespace SaturnCalculator.lib;

public class Orders
{
    public int ID { get; set; }
    public string TradingPartner { get; set; }
    public string PONumber { get; set; }
    public string TrailerNumber { get; set; }
    public string BillLandingNo { get; set; }
    public string TrackingNo { get; set; }
    public string ShipToCode { get; set; }
    public string CarrierCode { get; set; }
    public string ShipDate { get; set; }
    public string ShipTime { get; set; }
    public string Weight { get; set; }
    public string PackageType { get; set; }
    public string TotalPackageCount { get; set; }
    public double OrderQuantity { get; set; }
    public double OrderCost { get; set; }
    public IEnumerable<CalculatedLineItems> LineItems { get; set; }
    public IEnumerable<CalculatedVendorItem> VendorItems { get; set; }
}