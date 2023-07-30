using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NogorApp.Migrations
{
    public partial class AboutInfoCorrection : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Adddress",
                table: "AboutInfos",
                newName: "Address");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Address",
                table: "AboutInfos",
                newName: "Adddress");
        }
    }
}
