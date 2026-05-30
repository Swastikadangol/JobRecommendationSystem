using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobRecommendationAPI.Migrations
{
    /// <inheritdoc />
    public partial class addfieldemployer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "About",
                table: "Employers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Employers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Employers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanySize",
                table: "Employers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Facebook",
                table: "Employers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Industry",
                table: "Employers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Instagram",
                table: "Employers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkedIn",
                table: "Employers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PostalCode",
                table: "Employers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Province",
                table: "Employers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Twitter",
                table: "Employers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Website",
                table: "Employers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "About",
                table: "Employers");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Employers");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Employers");

            migrationBuilder.DropColumn(
                name: "CompanySize",
                table: "Employers");

            migrationBuilder.DropColumn(
                name: "Facebook",
                table: "Employers");

            migrationBuilder.DropColumn(
                name: "Industry",
                table: "Employers");

            migrationBuilder.DropColumn(
                name: "Instagram",
                table: "Employers");

            migrationBuilder.DropColumn(
                name: "LinkedIn",
                table: "Employers");

            migrationBuilder.DropColumn(
                name: "PostalCode",
                table: "Employers");

            migrationBuilder.DropColumn(
                name: "Province",
                table: "Employers");

            migrationBuilder.DropColumn(
                name: "Twitter",
                table: "Employers");

            migrationBuilder.DropColumn(
                name: "Website",
                table: "Employers");
        }
    }
}
