using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace apis_web_services_projeto_saber_mais.Models
{
    [Table("Usuarios")] 
    public class Usuario : LinksHATEOS
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Nome { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        [JsonIgnore]
        public string Password { get; set; }
        [Required]
        public string Cpf { get; set; }
        [Required]
        public EnumTipoUsuario Tipo { get; set; }

        public enum EnumTipoUsuario
        {
            Aluno,
            Professor,
            Admin
        }
    }
}
