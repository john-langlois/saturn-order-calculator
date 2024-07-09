using Microsoft.AspNetCore.Http;
using SaturnCalculator.entity;
using SaturnCalculator.entity.Models;

namespace SaturnCalculator.lib.Interfaces;

public interface IEmailService
{
  public Task<int> SendConfirmationEmail(Email email);
}
