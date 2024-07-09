using System.Net;
using System.Net.Mail;
using SaturnCalculator.lib.Interfaces;
using Microsoft.Extensions.Options;
using SaturnCalculator.lib.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using SaturnCalculator.entity;
using SaturnCalculator.entity.Models;

namespace SaturnCalculator.lib.Services
{
    public class EmailService: IEmailService
    {
        private readonly IOptionsMonitor<AppSettings> options;

        public EmailService(IOptionsMonitor<AppSettings> options)
        {
            this.options = options;
        }

        public async Task<int> SendConfirmationEmail(Email email)
        {
            
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("ordersnoreplystdwi@gmail.com");
            mailMessage.To.Add("mnur@stdwi.com");
            mailMessage.Subject = "Auto Generated - New Order Invoice Uploaded";
            mailMessage.Body = $"Order Invoice ready for processing " +
                               $"PO Number {email.Orders.PONumber}";

            if (email.Attachment != null && email.Attachment.Length > 0)
            {
                var stream = new MemoryStream();
                await email.Attachment.CopyToAsync(stream);
                stream.Position = 0; // Ensure the stream is positioned at the beginning

                Attachment attachment = new Attachment(stream, email.Attachment.FileName);
                mailMessage.Attachments.Add(attachment);
            }

            SmtpClient smtpClient = new SmtpClient();
            smtpClient.Host = options.CurrentValue.HostName;
            smtpClient.Port = options.CurrentValue.Port;
            smtpClient.UseDefaultCredentials = false;
            smtpClient.Credentials = new NetworkCredential(options.CurrentValue.EmailAccount, options.CurrentValue.EmailPassword);
            smtpClient.EnableSsl = true;

            await smtpClient.SendMailAsync(mailMessage);
            return 200;
        }
    }
}