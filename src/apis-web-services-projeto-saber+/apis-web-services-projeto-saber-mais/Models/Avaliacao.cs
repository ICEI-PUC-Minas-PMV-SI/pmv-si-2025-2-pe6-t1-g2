using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace apis_web_services_projeto_saber_mais.Models
{
    [Table("Avaliacoes")]
    public class Avaliacao : LinksHATEOS
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "O campo 'nota' é obrigatório.")]
        [Range(0, 10, ErrorMessage = "A nota deve ser um valor entre 0 e 10.")]
        public int Nota { get; set; }
        
        [Required(ErrorMessage = "O campo 'comentario' é obrigatório.")]
        [StringLength(500, ErrorMessage = "O comentário não pode exceder 500 caracteres.")]
        public string Comentario { get; set; }

        // Chave estrangeira para o Agendamento
        [Required(ErrorMessage = "O campo 'agendamentoId' é obrigatório.")]
        public int AgendamentoId { get; set; }
        [ForeignKey("AgendamentoId")]
        public virtual Agendamento Agendamento { get; set; }


        // Chave estrangeira para quem fez a avaliação (o Avaliador)
        // Apenas um destes será preenchido.
        [Required(ErrorMessage = "O campo 'avaliadorAlunoId' é obrigatório.")]
        public int AvaliadorAlunoId { get; set; }
        public virtual Aluno AvaliadorAluno { get; set; }

        [Required(ErrorMessage = "O campo 'avaliadorProfessorId' é obrigatório.")]
        public int AvaliadorProfessorId { get; set; }
        public virtual Professor AvaliadorProfessor { get; set; }
    }
}
