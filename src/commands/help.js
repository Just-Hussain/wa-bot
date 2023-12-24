/**
 * @typedef {import('../types').Interaction} Interaction
 */

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Lists available commands."),

  aliases: ["h", "شعندك"],
  /**
   * @param {Interaction} interaction
   * @param {import("discord.js").Collection} commands
   */
  async execute(interaction, commands) {
    const txt = "";
    for (const command of commands) {
      txt += `/${command.data.name} [${command.aliases.toString()}]: ${
        command.data.description
      }\n`;
    }

    interaction.msg.reply(txt);
  },
};
