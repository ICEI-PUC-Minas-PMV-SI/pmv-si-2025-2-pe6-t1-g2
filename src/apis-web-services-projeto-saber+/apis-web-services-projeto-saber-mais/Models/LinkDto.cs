namespace apis_web_services_projeto_saber_mais.Models
{
    public class LinkDto
    {
        public int Id { get; set; } 
        public string Href { get; set; } // URL, link disponível para editar, apagar os dados...
        public string Rel { get; set; } // relacionamento, ação que o link representa (self, update, delete)
        public string Metodo { get; set; } // método HTTP (GET, POST, PUT, DELETE)

        public LinkDto(int id, string href, string rel, string metodo)
        {
            Id = id;
            Href = href;
            Rel = rel;
            Metodo = metodo;
        }
    }

    public class LinksHATEOS
    {
        public List<LinkDto> Links { get; set; } = new List<LinkDto>();
    }
}
