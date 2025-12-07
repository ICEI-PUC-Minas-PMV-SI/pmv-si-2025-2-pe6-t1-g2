using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace apis_web_services_projeto_saber_mais.Models
{
    public enum DiaDaSemana
    {
        Segunda, Terca, Quarta, Quinta, Sexta, Sabado, Domingo
    }

    [Table("Disponibilidades")]
    public class Disponibilidade
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DiaDaSemana DiaDaSemana { get; set; }

        [Required]
        public TimeSpan HoraInicio { get; set; }

        [Required]
        public TimeSpan HoraFim { get; set; }

        // Relação com Professor
        [Required]
        public int ProfessorId { get; set; }
        public virtual Professor Professor { get; set; }
    }
}
