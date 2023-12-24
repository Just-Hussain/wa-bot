/**
 * @typedef {import('../types').Interaction} Interaction
 */

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("everyone")
    .setDescription("every... one."),

  aliases: ["الكل"],

  /**
   * @param {Interaction} interaction
   */
  async execute(interaction) {
    const { msg, client } = interaction;
    try {
      const chat = await msg.getChat();

      let text = "";
      let mentions = [];

      for (let participant of chat.participants) {
        const contact = await client.getContactById(participant.id._serialized);

        mentions.push(contact);
        text += `@${participant.id.user} `;
      }

      if (msg.fromMe) {
        chat.sendMessage(text, { mentions });
      } else {
        msg.reply("لأ.");
      }
    } catch (err) {
      console.error(`/${this.data.name} failed`.red, err);
    }
  },
};
