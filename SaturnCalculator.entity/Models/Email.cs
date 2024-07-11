using Microsoft.AspNetCore.Http;
using SaturnCalculator.lib;

namespace SaturnCalculator.entity.Models;

public class Email
{
    public Orders Orders { get; set; }
    public IFormFile? Attachment { get; set; }
    public string OrderInfoJson { get; set; }
    public string VendorItemsJson { get; set; }
    public string LineItemsJson { get; set; }
}