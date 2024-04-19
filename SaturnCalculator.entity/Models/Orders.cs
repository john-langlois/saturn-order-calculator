namespace SaturnCalculator.lib;

public class Orders
{
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
    public float OrderQuantity { get; set; }
    public float OrderCost { get; set; }
    public List<CalculatedLineItems> LineItems { get; set; }
    public List<CalculatedVendorItem> VendorItems { get; set; }
}