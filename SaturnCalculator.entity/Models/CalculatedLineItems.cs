namespace SaturnCalculator.lib;

public class CalculatedLineItems
{
    public int ID { get; set; }
    public string SerialNo { get; set; }
    public string VendorItemNumber { get; set; }
    public string ShippedQuantity { get; set; }
    public string ItemCost { get; set; }
    public double TotalCost { get; set; }
    public int OrdersID { get; set; }
}