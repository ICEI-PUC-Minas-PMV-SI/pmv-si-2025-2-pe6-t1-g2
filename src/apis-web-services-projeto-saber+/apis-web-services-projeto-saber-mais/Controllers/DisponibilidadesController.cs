using apis_web_services_projeto_saber_mais.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace apis_web_services_projeto_saber_mais.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DisponibilidadesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DisponibilidadesController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            var disponibilidades = await _context.Disponibilidades
                .Include(d => d.Professor)
                .ToListAsync();
            return Ok(disponibilidades);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(int id)
        {
            var disponibilidade = await _context.Disponibilidades
                .Include(d => d.Professor)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (disponibilidade == null) return NotFound();

            return Ok(disponibilidade);
        }

        [HttpPost]
        public async Task<ActionResult> Create(Disponibilidade disponibilidade)
        {
            if (disponibilidade == null) return BadRequest();

            _context.Disponibilidades.Add(disponibilidade);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = disponibilidade.Id }, disponibilidade);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, Disponibilidade disponibilidade)
        {
            if (disponibilidade == null || id != disponibilidade.Id) return BadRequest();

            var existingDisponibilidade = await _context.Disponibilidades
                .Include(d => d.Professor)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (existingDisponibilidade == null) return NotFound();

            existingDisponibilidade.DiaDaSemana = disponibilidade.DiaDaSemana;
            existingDisponibilidade.HoraInicio = disponibilidade.HoraInicio;
            existingDisponibilidade.HoraFim = disponibilidade.HoraFim;
            existingDisponibilidade.ProfessorId = disponibilidade.ProfessorId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Disponibilidades.AnyAsync(d => d.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var disponibilidade = await _context.Disponibilidades.FindAsync(id);
            if (disponibilidade == null) return NotFound();

            _context.Disponibilidades.Remove(disponibilidade);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
