using System.ComponentModel.DataAnnotations;

namespace apis_web_services_projeto_saber_mais.Models
{
    public class AuthenticateDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
