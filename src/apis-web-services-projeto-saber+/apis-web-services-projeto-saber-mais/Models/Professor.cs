using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace apis_web_services_projeto_saber_mais.Models
{
    [Table("Professores")] // Tabela separada apenas para os dados específicos de Professor
    public class Professor : Usuario
    {
        [Required]
        public string Descricao { get; set; }
        // Coleções que serão armazenadas como JSON (use conversores no AppDbContext, se necessário)
        [Required]
        public List<string> Certificacoes { get; set; } = new();
        [Required]
        public List<string> Competencias { get; set; } = new();
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorHora { get; set; }

        // Relacionamentos
        //public ICollection<Area> Areas { get; set; } = new List<Area>();
        public ICollection<ProfessorArea> Areas { get; set; }
        public ICollection<Agendamento> AgendamentosComoProfessor { get; set; } = new List<Agendamento>();
        public ICollection<Disponibilidade> Disponibilidades { get; set; } = new List<Disponibilidade>();
        public ICollection<Avaliacao> Avaliacoes { get; set; } = new List<Avaliacao>();
    }
}
