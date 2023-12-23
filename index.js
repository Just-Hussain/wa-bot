/**
 * @typedef {import('whatsapp-web.js').Client} Client
 */

/**
 * @typedef {import('discord.js').Collection} Collection
 */

/**
 * @typedef {Client & { commands: Collection }} ExtendedClient
 */

/**
 * @property {Collection} commands - Commands collection attached to the whatsapp-web.js client
 */

const { Client, LocalAuth, Events } = require("whatsapp-web.js");
const { Collection } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const qrcode = require("qrcode-terminal");
const colors = require("colors");

/**
 * @type {ExtendedClient}
 */
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    // 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  },
  // takeoverOnConflict: false,
  // ffmpegPath: 'D:\\Program Files\\ffmpeg-N-100892-g44e27d937d-win64-gpl-shared\\ffmpeg-N-100892-g44e27d937d-win64-gpl-shared\\bin',
  // restartOnAuthFail: false
});

// attach command handlers collection to the client
client.commands = new Collection();

// import and attach all command files
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);

    if ("aliases" in command) {
      for (const alias of command.aliases) {
        client.commands.set(alias, command);
      }
    }
  } else {
    console.warn(
      `The command at ${filePath} is missing a required "data" or "execute" property.`
        .yellow
    );
  }
}

client.on(Events.QR_RECEIVED, (qr) => {
  qrcode.generate(qr, { small: true });
});

// Save session values to the file upon successful auth
client.on(Events.AUTHENTICATED, (session) => {
  console.log(`Authed!`.blue);
});

client.on(Events.AUTHENTICATION_FAILURE, (msg) => {
  // Fired if session restore was unsuccessfull
  console.error(`AUTHENTICATION FAILURE`.red, msg);
});

client.on(Events.READY, () => {
  console.log(`Client is ready!`.blue);
});

client.on(Events.MESSAGE_CREATE, async (msg) => {
  if (!msg.body.startsWith("/")) return;
  const commandName = msg.body.split(" ")[0].substring(1);
  const command = client.commands.get(commandName);

  if (!command) {
    console.error(`No command matching ${commandName} was found.`.red);
    return;
  }

  try {
    await command.execute(msg);
  } catch (error) {
    console.error(error);
  }
});

client.initialize(); // RUN!
