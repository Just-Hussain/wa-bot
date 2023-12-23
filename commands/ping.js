/**
 * @typedef {import('whatsapp-web.js').Message}
 */

const { SlashCommandBuilder } = require("discord.js");
const { Message } = require("whatsapp-web.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  aliases: ["p"],

  /**
   * @param {Message} msg
   */
  async execute(msg) {
    await msg.reply("Pong!");
  },
};
