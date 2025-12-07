using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace apis_web_services_projeto_saber_mais.Migrations
{
    /// <inheritdoc />
    public partial class M007 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Agendamentos_Usuarios_AlunoId",
                table: "Agendamentos");

            migrationBuilder.DropForeignKey(
                name: "FK_Avaliacoes_Usuarios_AvaliadorAlunoId",
                table: "Avaliacoes");

            migrationBuilder.DropColumn(
                name: "Descricao",
                table: "Usuarios");

            migrationBuilder.AddColumn<int>(
                name: "Tipo",
                table: "Usuarios",
                type: "int",
                nullable: false,
                defaultValue: 0);

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

            migrationBuilder.AddColumn<string>(
                name: "Descricao",
                table: "Professores",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "ValorHora",
                table: "Professores",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<string>(
                name: "Comentario",
                table: "Avaliacoes",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "Alunos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alunos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Alunos_Usuarios_Id",
                        column: x => x.Id,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.Sql(@"
                    INSERT INTO Alunos (Id, Descricao)
                    SELECT Id, NULL FROM Usuarios WHERE Tipo = 0
                ");

            migrationBuilder.AddForeignKey(
                name: "FK_Agendamentos_Alunos_AlunoId",
                table: "Agendamentos",
                column: "AlunoId",
                principalTable: "Alunos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Avaliacoes_Alunos_AvaliadorAlunoId",
                table: "Avaliacoes",
                column: "AvaliadorAlunoId",
                principalTable: "Alunos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Agendamentos_Alunos_AlunoId",
                table: "Agendamentos");

            migrationBuilder.DropForeignKey(
                name: "FK_Avaliacoes_Alunos_AvaliadorAlunoId",
                table: "Avaliacoes");

            migrationBuilder.DropTable(
                name: "Alunos");

            migrationBuilder.DropColumn(
                name: "Tipo",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Descricao",
                table: "Professores");

            migrationBuilder.DropColumn(
                name: "ValorHora",
                table: "Professores");

            migrationBuilder.AddColumn<string>(
                name: "Descricao",
                table: "Usuarios",
                type: "nvarchar(max)",
                nullable: true);

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

            migrationBuilder.AlterColumn<string>(
                name: "Comentario",
                table: "Avaliacoes",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AddForeignKey(
                name: "FK_Agendamentos_Alunos_AlunoId",
                table: "Agendamentos",
                column: "AlunoId",
                principalTable: "Alunos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Avaliacoes_Alunos_AvaliadorAlunoId",
                table: "Avaliacoes",
                column: "AvaliadorAlunoId",
                principalTable: "Alunos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
