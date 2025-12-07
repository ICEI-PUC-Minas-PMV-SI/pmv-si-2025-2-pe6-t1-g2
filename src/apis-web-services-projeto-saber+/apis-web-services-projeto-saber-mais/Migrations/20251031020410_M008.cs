using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace apis_web_services_projeto_saber_mais.Migrations
{
    /// <inheritdoc />
    public partial class M008 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProfessorId",
                table: "Avaliacoes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DisciplinaId",
                table: "Agendamentos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Avaliacoes_ProfessorId",
                table: "Avaliacoes",
                column: "ProfessorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Avaliacoes_Professores_ProfessorId",
                table: "Avaliacoes",
                column: "ProfessorId",
                principalTable: "Professores",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Avaliacoes_Professores_ProfessorId",
                table: "Avaliacoes");

            migrationBuilder.DropIndex(
                name: "IX_Avaliacoes_ProfessorId",
                table: "Avaliacoes");

            migrationBuilder.DropColumn(
                name: "ProfessorId",
                table: "Avaliacoes");

            migrationBuilder.DropColumn(
                name: "DisciplinaId",
                table: "Agendamentos");
        }
    }
}
