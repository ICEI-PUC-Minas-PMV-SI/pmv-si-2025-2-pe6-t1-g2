using apis_web_services_projeto_saber_mais.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace apis_web_services_projeto_saber_mais.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AvaliacoesController : ControllerBase
    {
        //Essa configuração de contexto é necessária para que o controller consiga se comunicar com o banco de dados
        private readonly AppDbContext _context;

        public AvaliacoesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet] // GET: api/Avaliacoes
        public async Task<ActionResult> GetAll()
        {
            var model = await _context.Avaliacoes.ToListAsync();
            return Ok(model);
        }

        [HttpPost]
        public async Task<ActionResult> Create(Avaliacao model)
        {
            if (!ModelState.IsValid)
            {
                // Retorna 400 com os erros de validação encontrados (ex: "O campo 'nota' é obrigatório.")
                return BadRequest(ModelState);
            }

            var agendamentoExistente = await _context.Agendamentos.FindAsync(model.AgendamentoId);

            if (agendamentoExistente == null)
            {
                return BadRequest(new { message = $"Agendamento com o ID {model.AgendamentoId} não foi encontrado." });
            }

            if (agendamentoExistente.AlunoId != model.AvaliadorAlunoId || agendamentoExistente.ProfessorId != model.AvaliadorProfessorId)
            {
                return BadRequest(new { message = "O aluno ou professor avaliador não corresponde aos dados do agendamento." });
            }

            // Se todas as validações passaram, procede com a criação
            try
            {
                _context.Avaliacoes.Add(model);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetById", new { id = model.Id }, model);
            }
            catch (Exception ex)
            {
                // Uma camada extra de segurança para capturar qualquer outro erro inesperado
                // e evitar o erro 500 genérico, dando um pouco mais de contexto.
                return StatusCode(500, new { message = "Ocorreu um erro interno ao salvar a avaliação.", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(int id)
        {
            var model = await _context.Avaliacoes
                .Include(u => u.Agendamento) // Inclui o agendamento referente
                .Include(u => u.AvaliadorAluno) // Inclui as informações do aluno
                .Include(u => u.AvaliadorProfessor) // Inclui as informações do professor
                .FirstOrDefaultAsync(c => c.Id == id);

            if (model == null)
            {
                return NotFound();
            }

            GerarLinks(model);
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, Avaliacao model)
        {
            if (id != model.Id) return BadRequest();

            var avaliacaoDb = await _context.Avaliacoes.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);

            if (avaliacaoDb == null) return NotFound();

            _context.Avaliacoes.Update(model);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var model = await _context.Avaliacoes.FindAsync(id);

            if (model == null) return NotFound();

            _context.Avaliacoes.Remove(model);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private void GerarLinks(Avaliacao model)
        {
            model.Links.Add(new LinkDto(model.Id, Url.ActionLink(), rel: "self", metodo: "GET"));
            model.Links.Add(new LinkDto(model.Id, Url.ActionLink(), rel: "update_usuario", metodo: "PUT"));
            model.Links.Add(new LinkDto(model.Id, Url.ActionLink(), rel: "delete_usuario", metodo: "DELETE"));
        }

    }
}
