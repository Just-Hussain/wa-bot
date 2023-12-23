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
  try {
    let media = await msg.downloadMedia();
    console.log(`Media type: ${media.mimetype}. Sending...`.cyan);

    let reply = await recipient.reply(media, recipient.from, {
      sendMediaAsSticker: true,
      media: true,
    });
    console.log(`Replied w/ Media ?: ${reply.hasMedia}`.cyan);
  } catch (err) {
    console.log(`${err.message}`.red);

    if (err.message.includes("Evaluation failed: TypeError:")) {
      if (og) {
        og.reply("Can't find the media, maybe re-send it ?");
      } else {
        msg.reply("Can't find the media, maybe re-send it ?");
      }
    }
  }
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
    if (msg.hasMedia) {
      stickerize(msg);
    } else if (msg.hasQuotedMsg) {
      try {
        let quoted = await msg.getQuotedMessage();

        console.log(`quoted hasMedia ?: ${quoted.hasMedia}`.magenta);
        if (quoted.hasMedia) {
          stickerize(quoted, msg);
        }
      } catch (err) {
        console.log(`err getting quoted ` + err.message.red);
      }
    }
  },
};
