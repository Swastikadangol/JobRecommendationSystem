using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobRecommendationAPI.Migrations
{
    /// <inheritdoc />
    public partial class fixadminpasswordhash : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "Password",
                value: "$2a$11$oLpYr/taY9HT6HiCd.IpFOfw5eGJC5kPxeQXW47OqaCJpTrR90Dsq");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "Password",
                value: "$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyNa1g8Ue.");
        }
    }
}
