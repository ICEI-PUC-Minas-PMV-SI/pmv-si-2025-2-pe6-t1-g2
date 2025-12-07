using apis_web_services_projeto_saber_mais.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace apis_web_services_projeto_saber_mais.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgendamentosController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AgendamentosController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            var agendamentos = await _context.Agendamentos
                .Include(a => a.Aluno)
                .Include(a => a.Professor)
                .ToListAsync();
            return Ok(agendamentos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(int id)
        {
            var agendamento = await _context.Agendamentos
                .Include(a => a.Aluno)
                .Include(a => a.Professor)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (agendamento == null) return NotFound();

            return Ok(agendamento);
        }

        [HttpPost]
        public async Task<ActionResult> Create(Agendamento agendamento)
        {
            if (agendamento == null) return BadRequest();

            // Garante que o EF gere o ID
            agendamento.Id = 0;

            _context.Agendamentos.Add(agendamento);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = agendamento.Id }, agendamento);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, Agendamento agendamento)
        {
            if (agendamento == null || id != agendamento.Id) return BadRequest();

            var existingAgendamento = await _context.Agendamentos
                .FirstOrDefaultAsync(a => a.Id == id);

            if (existingAgendamento == null) return NotFound();

            existingAgendamento.DataHora = agendamento.DataHora;
            existingAgendamento.Status = agendamento.Status;
            existingAgendamento.AlunoId = agendamento.AlunoId;
            existingAgendamento.ProfessorId = agendamento.ProfessorId;
            existingAgendamento.DisciplinaId = agendamento.DisciplinaId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Agendamentos.AnyAsync(a => a.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var agendamento = await _context.Agendamentos.FindAsync(id);
            if (agendamento == null) return NotFound();

            _context.Agendamentos.Remove(agendamento);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
