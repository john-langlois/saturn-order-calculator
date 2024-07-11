using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SaturnCalculator.entity;
using SaturnCalculator.entity.Models;
using SaturnCalculator.lib;
using SaturnCalculator.lib.Interfaces;

namespace SaturnCalculator.api.Controllers;

[ApiController]
public class EmailController : ControllerBase
{
    private readonly IEmailService iDB;

    public EmailController(IEmailService idb)
    {
        this.iDB = idb;
    }

    [HttpPost]
    [Route("[controller]/SendEmail")]
    public async Task<int> SendEmail([FromForm] Email email)
    {
        if (email.OrderInfoJson != null)
        {
            email.Orders.OrderInfo = JsonConvert.DeserializeObject<IEnumerable<OrderInfo>>(email.OrderInfoJson);
        }
            
        if (email.VendorItemsJson != null)
        {
            email.Orders.VendorItems = JsonConvert.DeserializeObject<IEnumerable<CalculatedVendorItem>>(email.VendorItemsJson);
        }
            
        if (email.LineItemsJson != null)
        {
            email.Orders.LineItems = JsonConvert.DeserializeObject<IEnumerable<CalculatedLineItems>>(email.LineItemsJson);
        }

        return await iDB.SendConfirmationEmail(email);
    }

}