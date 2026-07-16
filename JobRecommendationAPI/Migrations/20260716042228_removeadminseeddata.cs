using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobRecommendationAPI.Migrations
{
    /// <inheritdoc />
    public partial class removeadminseeddata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "CreatedAt", "Email", "Password", "Role", "Status", "UserName" },
                values: new object[] { 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@jobrec.com", "$2a$11$oLpYr/taY9HT6HiCd.IpFOfw5eGJC5kPxeQXW47OqaCJpTrR90Dsq", "Admin", "Active", "admin" });
        }
    }
}
