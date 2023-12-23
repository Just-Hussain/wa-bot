/**
 * @typedef {import('whatsapp-web.js').Message}
 */

const { SlashCommandBuilder } = require("discord.js");
const { Message } = require("whatsapp-web.js");

/**
 * Media to stickers 👾
 * @param {Message} msg The message that contains the media to be converted into a sticker.
 * @param {Message} og If the command was a reply to a message with media, pass the original message
 */
async function stickerize(msg, og = null) {
  let recipient;
  og ? (recipient = og) : (recipient = msg);

  console.log(`Downloading...`.cyan);
  let media = await msg.downloadMedia();
  if (!media) {
    console.error(`Could not download media :(`.red);
    recipient.reply("ما قدرت احمل اللي تبي تحوله 😔");
  }
  console.log(`Media type: ${media.mimetype}. Sending...`.cyan);

  let reply = await recipient.reply(media, recipient.from, {
    sendMediaAsSticker: true,
    media: true,
  });
  console.log(`Replied w/ Media ?: ${reply.hasMedia}`.cyan);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sticker")
    .setDescription("Converts media into sticker."),

  aliases: ["s", "ستيكر"],
  /**
   * @param {Message} msg
   */
  async execute(msg) {
    try {
      if (msg.hasMedia) {
        stickerize(msg);
      } else if (msg.hasQuotedMsg) {
        let quoted = await msg.getQuotedMessage();
        if (!quoted) {
          console.error("Could not get quoted message :(");
          msg.reply("ما قدرت اجيب الرسالة اللي ممنشنها 🚬");
        }
        console.log(`quoted hasMedia ?: ${quoted.hasMedia}`.magenta);
        if (quoted.hasMedia) {
          stickerize(quoted, msg);
        }
      }
    } catch (err) {
      console.error(`/${this.data.name} failed`.red, err);
    }
  },
};
