/**
 * @typedef {import('whatsapp-web.js').Message}
 */

const path = require("path");
const { SlashCommandBuilder } = require("discord.js");
const { Message, MessageMedia } = require("whatsapp-web.js");

async function audioize(msg, audioPath) {
  console.log(`!s hasQuoted ?: ${msg.hasQuotedMsg}`.magenta);

  let m;
  msg.hasQuotedMsg ? (m = await msg.getQuotedMessage()) : (m = msg);

  let media = MessageMedia.fromFilePath(path.join(__dirname, audioPath));
  console.log(`Media type: ${media.mimetype}. Sending...`.cyan);

  let reply = await m.reply(media);
  console.log(`Replied w/ bruh ?: ${reply.hasMedia}`.cyan);
}

module.exports = {
  data: new SlashCommandBuilder().setName("bruh").setDescription("bruh..."),

  aliases: ["براه"],

  /**
   * @param {Message} msg
   */
  async execute(msg) {
    audioize(msg, "../media/bruh.mp3");
  },
};
