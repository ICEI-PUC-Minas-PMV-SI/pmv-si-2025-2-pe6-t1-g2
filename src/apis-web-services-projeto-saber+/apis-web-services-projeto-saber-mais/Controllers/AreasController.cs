using apis_web_services_projeto_saber_mais.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace apis_web_services_projeto_saber_mais.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AreasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AreasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet] // GET: api/Areas
        public async Task<ActionResult> GetAll()
        {
            var model = await _context.Areas.ToListAsync();
            return Ok(model);
        }

        [HttpPost]
        public async Task<ActionResult> Create(Area model)
        {
            _context.Areas.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetById", new { id = model.Id }, model);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(int id)
        {
            var model = await _context.Areas
                .Include(u => u.Professores) // Inclui as informações dos professores
                .FirstOrDefaultAsync(c => c.Id == id);

            if (model == null)
            {
                return NotFound();
            }

            GerarLinks(model);
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, Area model)
        {
            if (id != model.Id) return BadRequest();

            var areaDb = await _context.Areas.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);

            if (areaDb == null) return NotFound();

            _context.Areas.Update(model);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var model = await _context.Areas.FindAsync(id);

            if (model == null) return NotFound();

            _context.Areas.Remove(model);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private void GerarLinks(Area model)
        {
            model.Links.Add(new LinkDto(model.Id, Url.ActionLink(), rel: "self", metodo: "GET"));
            model.Links.Add(new LinkDto(model.Id, Url.ActionLink(), rel: "update_usuario", metodo: "PUT"));
            model.Links.Add(new LinkDto(model.Id, Url.ActionLink(), rel: "delete_usuario", metodo: "DELETE"));
        }
    }
}
