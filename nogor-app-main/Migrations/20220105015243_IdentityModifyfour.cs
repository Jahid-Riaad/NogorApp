using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NogorApp.Migrations
{
    public partial class IdentityModifyfour : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FLink",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LLink",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TLink",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FLink",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LLink",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "TLink",
                table: "AspNetUsers");
        }
    }
}
