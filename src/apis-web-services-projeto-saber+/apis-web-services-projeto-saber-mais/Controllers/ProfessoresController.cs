using apis_web_services_projeto_saber_mais.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace apis_web_services_projeto_saber_mais.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProfessoresController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ProfessoresController(AppDbContext context) => _context = context;

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            var professores = await _context.Professores
                .Include(p => p.Areas)
                .Include(p => p.Disponibilidades)
                .Include(p => p.AgendamentosComoProfessor)
                .Include(p => p.Avaliacoes)
                .ToListAsync();
            return Ok(professores);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(int id)
        {
            var professor = await _context.Professores
                .Include(p => p.Areas).ThenInclude(pa => pa.Area)
                .Include(p => p.Disponibilidades)
                .Include(p => p.AgendamentosComoProfessor)
                .Include(p => p.Avaliacoes)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (professor == null) return NotFound();

            return Ok(professor);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> Create(ProfessorDto professor)
        {
            if (professor == null) return BadRequest();

            Professor novoProfessor = new Professor()
            {
                Nome = professor.Nome,
                Email = professor.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(professor.Password),
                Cpf = professor.Cpf,
                Tipo = Usuario.EnumTipoUsuario.Professor,
                Descricao = professor.Descricao,
                Certificacoes = professor.Certificacoes ?? new List<string>(),
                Competencias = professor.Competencias ?? new List<string>(),
                ValorHora = professor.ValorHora
            };

            _context.Professores.Add(novoProfessor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = novoProfessor.Id }, novoProfessor);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, ProfessorDto professor)
        {
            if (professor == null || id != professor.Id) return BadRequest();

            var existingProfessor = await _context.Professores
                .Include(p => p.Areas)
                .Include(p => p.Disponibilidades)
                .Include(p => p.AgendamentosComoProfessor)
                .Include(p => p.Avaliacoes)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (existingProfessor == null) return NotFound();

            existingProfessor.Nome = professor.Nome;
            existingProfessor.Email = professor.Email;
            existingProfessor.Password = BCrypt.Net.BCrypt.HashPassword(professor.Password);
            existingProfessor.Cpf = professor.Cpf;
            existingProfessor.Tipo = professor.Tipo;
            existingProfessor.Descricao = professor.Descricao;
            existingProfessor.ValorHora = professor.ValorHora;

            existingProfessor.Certificacoes = professor.Certificacoes ?? new List<string>();
            existingProfessor.Competencias = professor.Competencias ?? new List<string>();

            //existingProfessor.Areas = professor.Areas ?? new List<Area>();
            //existingProfessor.Disponibilidades = professor.Disponibilidades ?? new List<Disponibilidade>();

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Professores.AnyAsync(p => p.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var professor = await _context.Professores.FindAsync(id);
            if (professor == null) return NotFound();

            _context.Professores.Remove(professor);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id}/areas")]
        public async Task<ActionResult> AddAreaToProfessor(int id, ProfessorArea model)
        {
            if(id != model.ProfessorId)
                return BadRequest("ID do Professor não corresponde.");
            _context.ProfessorAreas.Add(model);
            await _context.SaveChangesAsync();      

            return CreatedAtAction("GetById", new { id = model.ProfessorId }, model);
        }

        [HttpDelete("{id}/areas/{areaId}")]
        public async Task<ActionResult> DeleteArea(int id, int AreaId)
        {
            var model = await _context.ProfessorAreas
                .Where(c => c.ProfessorId == id && c.AreaId == AreaId)
                .FirstOrDefaultAsync();

            if (model == null) return NotFound();

            _context.ProfessorAreas.Remove(model);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
