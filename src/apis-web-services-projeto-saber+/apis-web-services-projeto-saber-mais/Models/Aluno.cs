using System.ComponentModel.DataAnnotations.Schema;

namespace apis_web_services_projeto_saber_mais.Models
{
    [Table("Alunos")]
    public class Aluno : Usuario
    {
        public string Descricao { get; set; }

        // Relacionamento: Um aluno pode ter vários agendamentos
        public ICollection<Agendamento> Agendamentos { get; set; }

        // Relacionamento: Um usuário pode fazer várias avaliações
        public ICollection<Avaliacao> AvaliacoesFeitas { get; set; }
        //public ICollection<Avaliacao> AvaliacoesComoProfessor { get; set; } = new List<Avaliacao>();
    }
}
