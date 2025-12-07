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
    public class AlunosController : ControllerBase
    {
        //Essa configuração de contexto é necessária para que o controller consiga se comunicar com o banco de dados
        private readonly AppDbContext _context;

        public AlunosController(AppDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet] // GET: api/Alunos; busca todos os alunos cadastrados no banco de dados
        public async Task<ActionResult> GetAll()
        {
            var model = await _context.Alunos.ToListAsync();
            return Ok(model);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> Create(AlunoDto usuario)
        {
            Aluno novoUsuario = new Aluno()
            {
                Nome = usuario.Nome,
                Email = usuario.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(usuario.Password),
                Cpf = usuario.Cpf,
                Tipo = Usuario.EnumTipoUsuario.Aluno,
                Descricao = usuario.Descricao
            };

            _context.Alunos.Add(novoUsuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetById", new { id = novoUsuario.Id }, novoUsuario);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(int id)
        {
            var usuario = await _context.Alunos
                .Include(u => u.Agendamentos) // Inclui os agendamentos do usuário aluno
                .Include(u => u.AvaliacoesFeitas) // Inclui as avaliações feitas pelo usuário aluno
                .FirstOrDefaultAsync(c => c.Id == id);

            if (usuario == null)
            {
                return NotFound();
            }

            return Ok(usuario);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, AlunoDto usuario)
        {
            if (id != usuario.Id) return BadRequest();

            var usuarioDb = await _context.Alunos.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);

            if (usuarioDb == null) return NotFound();

            usuarioDb.Nome = usuario.Nome;
            usuarioDb.Email = usuario.Email;
            usuarioDb.Password = BCrypt.Net.BCrypt.HashPassword(usuario.Password);
            usuarioDb.Cpf = usuario.Cpf;
            usuarioDb.Tipo = usuario.Tipo;
            usuarioDb.Descricao = usuario.Descricao;

            _context.Alunos.Update(usuarioDb);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var usuario = await _context.Alunos.FindAsync(id);

            if (usuario == null) return NotFound();

            _context.Alunos.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
