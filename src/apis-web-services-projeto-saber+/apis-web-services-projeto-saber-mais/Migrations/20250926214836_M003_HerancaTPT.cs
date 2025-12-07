using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace apis_web_services_projeto_saber_mais.Migrations
{
    /// <inheritdoc />
    public partial class M003_HerancaTPT : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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


            migrationBuilder.AddForeignKey(
                name: "FK_Professores_Usuarios_Id",
                table: "Professores",
                column: "Id",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Professores_Usuarios_Id",
                table: "Professores");


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
    }
}
