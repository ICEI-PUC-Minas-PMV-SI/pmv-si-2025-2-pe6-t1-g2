using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace apis_web_services_projeto_saber_mais.Migrations
{
    /// <inheritdoc />
    public partial class M002 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Avaliacoes_Professores_ProfessorId",
                table: "Avaliacoes");

            migrationBuilder.DropForeignKey(
                name: "FK_Professores_Usuarios_Id",
                table: "Professores");

            migrationBuilder.DropIndex(
                name: "IX_Avaliacoes_ProfessorId",
                table: "Avaliacoes");

            migrationBuilder.DropColumn(
                name: "Valor",
                table: "Professores");

            migrationBuilder.DropColumn(
                name: "ProfessorId",
                table: "Avaliacoes");

            migrationBuilder.AlterColumn<string>(
                name: "Competencias",
                table: "Professores",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Certificacoes",
                table: "Professores",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Descricao",
                table: "Professores",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Professores",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Nome",
                table: "Professores",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Descricao",
                table: "Professores");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Professores");

            migrationBuilder.DropColumn(
                name: "Nome",
                table: "Professores");

            migrationBuilder.AlterColumn<string>(
                name: "Competencias",
                table: "Professores",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Certificacoes",
                table: "Professores",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);


            migrationBuilder.AddColumn<decimal>(
                name: "Valor",
                table: "Professores",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "ProfessorId",
                table: "Avaliacoes",
                type: "int",
                nullable: true);

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

            migrationBuilder.AddForeignKey(
                name: "FK_Professores_Usuarios_Id",
                table: "Professores",
                column: "Id",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
