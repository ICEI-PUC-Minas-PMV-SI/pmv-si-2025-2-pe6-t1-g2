using System.ComponentModel.DataAnnotations;
using static apis_web_services_projeto_saber_mais.Models.Usuario;

namespace apis_web_services_projeto_saber_mais.Models
{
    public class ProfessorDto
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
        [Required]
        public EnumTipoUsuario Tipo { get; set; }
        [Required]
        public string Descricao { get; set; }
        [Required]
        public List<string> Certificacoes { get; set; }
        [Required]
        public List<string> Competencias { get; set; }
        [Required]
        public decimal ValorHora { get; set; }
    }
}
