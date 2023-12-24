/**
 * @typedef {import('../types').Interaction} Interaction
 */

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  aliases: ["p"],

  /**
   * @param {Interaction} interaction
   */
  async execute(interaction) {
    interaction.msg.reply("Pong!");
  },
};
