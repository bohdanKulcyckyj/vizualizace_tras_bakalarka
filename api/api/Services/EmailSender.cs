// EmailSender.cs

using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using PostmarkDotNet;
using PostmarkDotNet.Model;

namespace api.Services
{
    public interface IEmailSender
    {
        public Task SendEmailAsync(string email, string subject, string message);
    }
    public class EmailSender
    {
        private readonly PostmarkSettings _postmarkSettings;

        public EmailSender(IOptions<PostmarkSettings> postmarkSettings)
        {
            _postmarkSettings = postmarkSettings.Value;
        }

        public async Task SendEmailAsync(string email, string subject, string message)
        {
            var client = new PostmarkClient(_postmarkSettings.ApiKey);

            var postmarkMessage = new PostmarkMessage
            {
                From = _postmarkSettings.Email,
                To = email,
                Subject = subject,
                TextBody = message,
            };

            try
            {
                var response = await client.SendMessageAsync(postmarkMessage);
            }
            catch (Exception ex)
            {
                // Zpracování chyby při odesílání e-mailu
                throw new Exception($"Chyba nastala v SendEmailAsync {ex.Message}");
            }
        }
    }
}

