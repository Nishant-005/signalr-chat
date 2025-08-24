using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SignalRChatServer.Migrations
{
    /// <inheritdoc />
    public partial class RenameUserToUsername : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "User",
                table: "Messages",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "Messages",
                newName: "Content");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Messages",
                newName: "User");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Messages",
                newName: "Message");
        }
    }
}
