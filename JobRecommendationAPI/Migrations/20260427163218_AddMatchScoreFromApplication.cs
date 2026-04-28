using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobRecommendationAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddMatchScoreFromApplication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "MatchScore",
                table: "Applications",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MatchScore",
                table: "Applications");
        }
    }
}
