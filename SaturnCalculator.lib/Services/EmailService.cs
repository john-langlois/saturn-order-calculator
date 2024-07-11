using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using SaturnCalculator.lib.Interfaces;
using SaturnCalculator.lib.Models;
using ClosedXML.Excel;
using System.IO;
using System.Threading.Tasks;
using SaturnCalculator.entity.Models;
using Newtonsoft.Json;

namespace SaturnCalculator.lib.Services
{
    public class EmailService : IEmailService
    {
        private readonly IOptionsMonitor<AppSettings> options;

        public EmailService(IOptionsMonitor<AppSettings> options)
        {
            this.options = options;
        }

        public async Task<int> SendConfirmationEmail(Email email)
        {
            MailMessage mailMessage = new MailMessage
            {
                From = new MailAddress("ordersnoreplystdwi@gmail.com"),
                Subject = "Auto Generated - New Order Invoice Uploaded",
                Body = $"Order Invoice ready for processing. PO Number: {email.Orders.PONumber}"
            };

            mailMessage.To.Add("joao.langlois@hotmail.com");

            if (email.Orders.OrderInfo != null && email.Orders.VendorItems != null)
            {
                
                var stream = GenerateExcelFile(email.Orders, email.Orders.OrderInfo, email.Orders.VendorItems);
                stream.Position = 0; // Ensure the stream is positioned at the beginning

                var attachment = new Attachment(stream, "calculatedOrders.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                mailMessage.Attachments.Add(attachment);

                SmtpClient smtpClient = new SmtpClient(options.CurrentValue.HostName, options.CurrentValue.Port)
                {
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(options.CurrentValue.EmailAccount, options.CurrentValue.EmailPassword),
                    EnableSsl = true
                };

                await smtpClient.SendMailAsync(mailMessage);
            }

            return 200;
        }


        private MemoryStream GenerateExcelFile(Orders orders, IEnumerable<OrderInfo> orderInfo, IEnumerable<CalculatedVendorItem> vendorItems)
        {
            var workbook = new XLWorkbook();
            var invoiceSheet = workbook.Worksheets.Add("Invoices");
            var invoiceDetailsSheet = workbook.Worksheets.Add("Invoice_Details");
            var invoicePaymentSchedulesSheet = workbook.Worksheets.Add("Invoice_Payment_Schedules");

            // INVOICE SHEET
            var invoiceHeaders = new[] { "CNTBTCH", "CNTITEM", "IDCUST", "IDINVC", "IDSHPT", "SPECINST", "TEXTTRX", "IDTRX", "ORDRNBR", "CUSTPO", "INVCDESC", "DATEINVC", "CODECURN", "EXCHRATEHC", "TERMCODE", "INVCTYPE" };
            for (int i = 0; i < invoiceHeaders.Length; i++)
            {
                invoiceSheet.Cell(1, i + 1).Value = invoiceHeaders[i];
            }

            var invoiceData = new[]
            {
                "0", "1", "", orders.BillLandingNo.Replace("SH", "IN"), orders.BillLandingNo.Replace("SH", "IN"), $"BOL #: {orders.BillLandingNo}", "1", "14", "", $"PO # {orders.PONumber}", "", orders.ShipDate.ToString(), "", "0", "", "0"
            };
            for (int i = 0; i < invoiceData.Length; i++)
            {
                invoiceSheet.Cell(2, i + 1).Value = invoiceData[i];
            }

            // Invoice Details
            var invoiceDetailsHeaders = new[] { "CNTBTCH", "CNTITEM", "CNTLINE", "IDITEM", "IDDIST", "TEXTDESC", "UNITMEAS", "QTYINVC", "AMTCOST", "AMTPRIC", "AMTEXTN", "AMTCOGS", "COMMENT" };
            for (int i = 0; i < invoiceDetailsHeaders.Length; i++)
            {
                invoiceDetailsSheet.Cell(1, i + 1).Value = invoiceDetailsHeaders[i];
            }

            int row = 2;
            foreach (var info in orderInfo)
            {
                foreach (var item in vendorItems)
                {
                    if (item.VendorItemNumber.Contains(info.PartNo))
                    {
                        var invoiceDetailData = new[]
                        {
                            "0", "1", item.TotalQuantity.ToString(), "", "", $"{item.VendorItemNumber}, {item.TotalQuantity} Pcs, Part Name {info.PartName}", $"{item.VendorItemNumber}, {item.TotalQuantity} Pcs, Part Name: {info.PartName}", "0", "0", "0", item.TotalCost.ToString(), "0", $"Job #: {info.JobNo}, U/P: {info.PPU}"
                        };
                        for (int i = 0; i < invoiceDetailData.Length; i++)
                        {
                            invoiceDetailsSheet.Cell(row, i + 1).Value = invoiceDetailData[i];
                        }
                        row++;
                    }
                }
            }

            // Invoice Payment Schedules
            var invoicePaymentHeaders = new[] { "CNTBTCH", "CNTITEM", "CNTPAYM", "DATEDUE", "AMTDUE", "DATEDISC", "AMTDISC", "AMTDUEHC", "AMTDISCHC" };
            for (int i = 0; i < invoicePaymentHeaders.Length; i++)
            {
                invoicePaymentSchedulesSheet.Cell(1, i + 1).Value = invoicePaymentHeaders[i];
            }

            var invoicePaymentData = new[]
            {
                "0", "1", "1", "", orders.OrderCost.ToString(), "", orders.OrderCost.ToString(), "", orders.OrderCost.ToString()
            };
            for (int i = 0; i < invoicePaymentData.Length; i++)
            {
                invoicePaymentSchedulesSheet.Cell(2, i + 1).Value = invoicePaymentData[i];
            }

            // Save to MemoryStream
            var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream;
        }
    }
}
