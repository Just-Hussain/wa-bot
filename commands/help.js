/**
 * @typedef {import('whatsapp-web.js').Message}
 * @typedef {import('discord.js').Collection}
 */

const { SlashCommandBuilder } = require("discord.js");
const { Message } = require("whatsapp-web.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Lists available commands."),

  aliases: ["h", "شعندك"],

  /**
   * @param {Message} msg
   * @param {Collection} commands
   */
  async execute(msg, commands) {
    const txt = "";
    for (const command of commands) {
      txt += `/${command.data.name} [${command.aliases.toString()}]: ${
        command.data.description
      }\n`;
    }

    msg.reply(txt);
  },
};
