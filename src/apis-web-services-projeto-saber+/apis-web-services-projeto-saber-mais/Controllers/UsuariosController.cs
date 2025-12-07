using apis_web_services_projeto_saber_mais.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Crypto.Generators;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace apis_web_services_projeto_saber_mais.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsuariosController : ControllerBase
    {
        //Essa configuração de contexto é necessária para que o controller consiga se comunicar com o banco de dados
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet] // GET: api/Usuarios; busca todos os usuários cadastrados no banco de dados
        public async Task<ActionResult> GetAll()
        {
            var usuarios = await _context.Usuarios.ToListAsync();
            return Ok(usuarios);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> Create(UsuarioDto usuario)
        {
            Usuario novoUsuario = new Usuario()
            {
                Nome = usuario.Nome,
                Email = usuario.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(usuario.Password),
                Cpf = usuario.Cpf,
                //Descricao = usuario.Descricao
            };

            _context.Usuarios.Add(novoUsuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetById", new {id = novoUsuario.Id}, novoUsuario);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(int id)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(c => c.Id == id);

            if (usuario == null)
            {
                return NotFound();
            }

            GerarLinks(usuario);
            return Ok(usuario);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, UsuarioDto usuario)
        {
            if (id != usuario.Id) return BadRequest();

            var usuarioDb = await _context.Usuarios.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);

            if (usuarioDb == null) return NotFound();

            usuarioDb.Nome = usuario.Nome;
            usuarioDb.Email = usuario.Email;
            usuarioDb.Password = BCrypt.Net.BCrypt.HashPassword(usuario.Password);
            usuarioDb.Cpf = usuario.Cpf;    
            //usuarioDb.Descricao = usuario.Descricao;

            _context.Usuarios.Update(usuarioDb);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null) return NotFound();

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [AllowAnonymous]
        [HttpPost("Authenticate")]
        public async Task<ActionResult> Authenticate(AuthenticateDto model)
        {
            var usuarioDb = await _context.Usuarios.FirstOrDefaultAsync(u=> u.Email == model.Email);

            if (usuarioDb == null || !BCrypt.Net.BCrypt.Verify(model.Password, usuarioDb.Password))
                return Unauthorized(new { message = "Email ou senha inválidos." });

            var jwt = GenerateJwtToken(usuarioDb);

            // Cria cookie seguro e HttpOnly
            //var cookieOptions = new CookieOptions
            //{
            //    HttpOnly = true,
            //    Secure = true, // mantenha true se for HTTPS, false apenas para localhost HTTP
            //    SameSite = SameSiteMode.None,
            //    Expires = DateTime.UtcNow.AddHours(8)
            //};

            //Response.Cookies.Append("jwt", jwt, cookieOptions);

            //return Ok(usuarioDb);

            return Ok(new { jwtToken = jwt });
        }

        private string GenerateJwtToken(Usuario model)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("qRdTMX205LuFGg3zVccB8NxD2p6g0YOB");
            var claims = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, model.Id.ToString()),
                new Claim(ClaimTypes.Email, model.Email)
            });

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), 
                SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult> GetLoggedUser()
        {
            // Pega o ID do usuário do token JWT
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var usuario = await _context.Usuarios
                .Where(u => u.Id == int.Parse(userId))
                .Select(u => new {
                    u.Id,
                    u.Nome,
                    u.Email
                })
                .FirstOrDefaultAsync();

            if (usuario == null)
                return NotFound();

            return Ok(usuario);
        }


        [Authorize]
        [HttpPost("Logout")]
        public ActionResult Logout()
        {
            if (Request.Cookies["jwt"] != null)
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true, // mantenha true se for HTTPS, false apenas para localhost HTTP
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(-1) // Define a expiração para uma data passada
                };
                Response.Cookies.Append("jwt", "", cookieOptions);
            }
            return Ok(new { message = "Logout realizado com sucesso." });
        }

        private void GerarLinks(Usuario usuario)
        {
            usuario.Links.Add(new LinkDto(usuario.Id, Url.ActionLink(), rel: "self", metodo: "GET"));
            usuario.Links.Add(new LinkDto(usuario.Id, Url.ActionLink(), rel: "update_usuario", metodo: "PUT"));
            usuario.Links.Add(new LinkDto(usuario.Id, Url.ActionLink(), rel: "delete_usuario", metodo: "DELETE"));
        }

    }
}
