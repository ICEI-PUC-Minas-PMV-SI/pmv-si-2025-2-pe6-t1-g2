using System.ComponentModel.DataAnnotations.Schema;

namespace apis_web_services_projeto_saber_mais.Models
{
    [Table("ProfessorArea")]
    public class ProfessorArea
    {
        public int AreaId { get; set; }
        public Area Area { get; set; }

        public int ProfessorId { get; set; }
        public Professor Professor { get; set; }
    }
}
