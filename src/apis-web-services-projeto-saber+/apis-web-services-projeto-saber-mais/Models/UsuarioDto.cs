using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace apis_web_services_projeto_saber_mais.Models
{
    public class UsuarioDto
    {
        public int? Id { get; set; }
        [Required]
        public string Nome { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string Cpf { get; set; }
    }
}
