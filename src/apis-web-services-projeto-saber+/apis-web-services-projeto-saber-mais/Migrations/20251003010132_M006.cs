using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace apis_web_services_projeto_saber_mais.Migrations
{
    public partial class M006 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Renomeia colunas da tabela ProfessorArea
            //migrationBuilder.RenameColumn(
            //    name: "ProfessoresId",
            //    table: "ProfessorArea",
            //    newName: "ProfessorId");

            //migrationBuilder.RenameColumn(
            //    name: "AreasId",
            //    table: "ProfessorArea",
            //    newName: "AreaId");

            //migrationBuilder.RenameIndex(
            //    name: "IX_ProfessorArea_ProfessoresId",
            //    table: "ProfessorArea",
            //    newName: "IX_ProfessorArea_ProfessorId");

            // Remove quaisquer FKs antigas, se existirem
            migrationBuilder.Sql(@"
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_ProfessorArea_Areas_AreasId')
    ALTER TABLE ProfessorArea DROP CONSTRAINT [FK_ProfessorArea_Areas_AreasId];

IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_ProfessorArea_Professores_ProfessoresId')
    ALTER TABLE ProfessorArea DROP CONSTRAINT [FK_ProfessorArea_Professores_ProfessoresId];
");

            // Adiciona as FKs corretas
            //migrationBuilder.AddForeignKey(
            //    name: "FK_ProfessorArea_Areas_AreaId",
            //    table: "ProfessorArea",
            //    column: "AreaId",
            //    principalTable: "Areas",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Cascade);

            //migrationBuilder.AddForeignKey(
            //    name: "FK_ProfessorArea_Professores_ProfessorId",
            //    table: "ProfessorArea",
            //    column: "ProfessorId",
            //    principalTable: "Professores",
            //    principalColumn: "Id",
            //    onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove as FKs
            //migrationBuilder.DropForeignKey(
            //    name: "FK_ProfessorArea_Areas_AreaId",
            //    table: "ProfessorArea");

            //migrationBuilder.DropForeignKey(
            //    name: "FK_ProfessorArea_Professores_ProfessorId",
            //    table: "ProfessorArea");

            // Renomeia colunas de volta
            //migrationBuilder.RenameColumn(
            //    name: "ProfessorId",
            //    table: "ProfessorArea",
            //    newName: "ProfessoresId");

            //migrationBuilder.RenameColumn(
            //    name: "AreaId",
            //    table: "ProfessorArea",
            //    newName: "AreasId");

            //migrationBuilder.RenameIndex(
            //    name: "IX_ProfessorArea_ProfessorId",
            //    table: "ProfessorArea",
            //    newName: "IX_ProfessorArea_ProfessoresId");
        }
    }
}
