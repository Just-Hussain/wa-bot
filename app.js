const { log } = require('console')
const fs = require('fs')
const qrcode = require('qrcode-terminal')
const { Client } = require('whatsapp-web.js')
const { MessageMedia } = require('whatsapp-web.js')
// const Util = require('whatsapp-web.js/src/util/Util')
const colors = require('colors')
const ytdl = require('ytdl-core')
const readline = require('readline')
const path = require('path')

// ----------------------------------

/*
***************************
|	INIT	|
***************************
*/

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json'

// Load the session data if it has been previously saved
let sessionData
if (fs.existsSync(SESSION_FILE_PATH)) {
	sessionData = require(SESSION_FILE_PATH)
}

// Use the saved values
const client = new Client({
	session: sessionData,
	puppeteer: {
		executablePath:
			'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
	},
	// takeoverOnConflict: false,
	// ffmpegPath: 'D:\\Program Files\\ffmpeg-N-100892-g44e27d937d-win64-gpl-shared\\ffmpeg-N-100892-g44e27d937d-win64-gpl-shared\\bin',
	// restartOnAuthFail: false
})

client.on('qr', qr => {
	qrcode.generate(qr, { small: true })
})

// Save session values to the file upon successful auth
client.on('authenticated', session => {
	sessionData = session
	fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
		if (err) {
			console.error(err.message.red)
		}
	})
})

client.on('auth_failure', msg => {
	// Fired if session restore was unsuccessfull
	console.error(`${t} AUTHENTICATION FAILURE`.red, msg)
})

client.on('ready', () => {
	console.log(`${t} Client is ready!`.blue)
})

client.initialize()

// ----------------------------------

/*
***************************
|	COMMANDS CONSTANTS	|
***************************
*/

const t = '[WA-BOT]'

let HELP = '!help'
let H = '!h'
let EVERYONE = '!everyone'
let JADWAL = '!jadwal'
let STICKER = '!sticker'
let S = '!s'
let RANDOM = '!random'
let RANDOM_AR = '!عشوائي'
let PLAY = '!play'
let YTDL_COMMAND = '!ytdl'
let BRUH = '!bruh'
let RAGE = '!rage'

let commandsList = [
	HELP,
	H,
	EVERYONE,
	// JADWAL,
	STICKER,
	S,
	// RANDOM,
	RANDOM_AR,
	// PLAY,
	// YTDL_COMMAND,
	BRUH,
]

// ----------------------------------

/*
***************************
|	HELP GENERATOR	|
***************************
*/

let helpContent = `
⛷ *Commands List* ⛷

◼ To make a sticker:
	send or mention an img/vid/gif with:
	\t\t	!sticker _(OR)_ !s

◼ To mention everyone:
	\t\t	!everyone

◼ To get this list:
	\t\t	!help _(OR)_ !h
`
helpContent += '\n\n*All w/ Undocumented*\n'

commandsList.forEach(command => {
	helpContent += `◼ ${command}\n`
})

// ----------------------------------

/*
***************************
|	LISTENERS	|
***************************
*/

client.on('message_create', async msg => {
	let body = msg.body.toLowerCase()
	let hasMedia = msg.hasMedia
	let hasQuotedMsg = msg.hasQuotedMsg
	let regexRand = new RegExp(`^${RANDOM_AR}`)
	let regexRand_en = new RegExp(`^${RANDOM}`)
	let regexYT = new RegExp(`^${PLAY}`)
	let regexYTDL = new RegExp(`^${YTDL_COMMAND}`)

	body.startsWith('!')
		? log(`${t} GOT MESSAGE: ${msg.body}`.magenta)
		: log(`${t} GOT MESSAGE: ${msg.body.substr(0, 16)}...`.yellow)

	if (body == HELP || body == H) {
		msg.reply(helpContent)
	} else if (body == EVERYONE) {
		// const chat = await msg.getChat()

		// let text = ''
		// let mentions = []

		// for (let participant of chat.participants) {
		// 	const contact = await client.getContactById(participant.id._serialized)

		// 	mentions.push(contact)
		// 	text += `@${participant.id.user} `
		// }

		// chat.sendMessage(text, { mentions })

		msg.reply('لأ.')
	} else if (body == JADWAL) {
	} else if (body == STICKER || body == S) {
		log(`${t} !s hasMedia ?: ${hasMedia}`.magenta)
		log(`${t} !s hasQuoted ?: ${hasQuotedMsg}`.magenta)

		if (hasMedia) {
			stickerize(msg)
		} else if (hasQuotedMsg) {
			try {
				let quoted = await msg.getQuotedMessage()

				log(`${t} !s quoted hasMedia ?: ${quoted.hasMedia}`.magenta)
				if (quoted.hasMedia) {
					stickerize(quoted, msg)
				}
			} catch (err) {
				log(`${t} err getting quoted ` + err.message.red)
			}
		}
	} else if (regexRand.test(body)) {
		let list = body.split('\n')
		let min = 1
		let max = list.length - 1

		let rand = Math.floor(Math.random() * (max - min + 1)) + min

		let item = list[rand]

		msg.reply(item)
	} else if (regexYT.test(body)) {
		let q = body.split('\n').pop()
		let query = q.replace(/\s/g, '+')
		let link = `https://www.youtube.com/results?search_query=${query}`

		msg.reply(link)
	} else if (regexYTDL.test(body)) {
		// let url = body.split('\n').pop()
		// // youtubeize(url, msg)
		// let media = MessageMedia.fromFilePath('./video.mp4')
		// let reply = await msg.reply(media, msg.from, { media: true })
	} else if (body == BRUH) {
		audioize(msg, './bruh.mp3')
	} else if (body == RAGE) {
		audioize(msg, './rage.mp3')
	}
})

async function stickerize(msg, og = null) {
	let recipient
	og ? (recipient = og) : (recipient = msg)

	log(`${t} Downloading...`.cyan)
	try {
		let media = await msg.downloadMedia()
		log(`${t} Media type: ${media.mimetype}. Sending...`.cyan)

		let reply = await recipient.reply(media, recipient.from, {
			sendMediaAsSticker: true,
			media: true,
		})
		log(`${t} Replied w/ Media ?: ${reply.hasMedia}`.cyan)

		// if (og) {
		// } else {
		// 	let reply = await msg.reply(media, msg.from, {
		// 		sendMediaAsSticker: true,
		// 		media: true,
		// 	})
		// 	log(`${t} Replied w/ Media ?: ${reply.hasMedia}`.cyan)
		// }
	} catch (err) {
		log(`${t} ${err.message}`.red)

		if (
			err.message.includes(
				"Evaluation failed: TypeError: Cannot read property 'mediaData' of undefined"
			)
		) {
			if (og) {
				og.reply("Can't find the media, maybe re-send it ?")
			} else {
				msg.reply("Can't find the media, maybe re-send it ?")
			}
		}
	}
}

function youtubeize(url, msg) {
	const output = path.resolve(__dirname, 'video.mp4')
	let starttime
	url = 'https://www.youtube.com/watch?v=9sPthPleEKo'
	const video = ytdl(url)

	video.pipe(fs.createWriteStream(output))

	video.once('response', () => {
		starttime = Date.now()
	})

	video.on('progress', (chunkLength, downloaded, total) => {
		const percent = downloaded / total
		const downloadedMinutes = (Date.now() - starttime) / 1000 / 60
		const estimatedDownloadTime =
			downloadedMinutes / percent - downloadedMinutes

		readline.cursorTo(process.stdout, 0)
		process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `)
		process.stdout.write(
			`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(
				total /
				1024 /
				1024
			).toFixed(2)}MB)\n`
		)
		process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`)
		process.stdout.write(
			`, estimated time left: ${estimatedDownloadTime.toFixed(2)}minutes `
		)

		readline.moveCursor(process.stdout, 0, -1)
	})

	video.on('end', async () => {
		process.stdout.write('\n\n')

		let media = MessageMedia.fromFilePath(output)

		let reply = await msg.reply(media, msg.from, { media: true })

		if (reply.hasMedia) {
			fs.unlink(output, err => {
				if (err) {
					console.error(err)
					return
				}

				log('file sent and removed')
				//file removed
			})
		}
	})
}

async function audioize(msg, audioPath) {
	log(`${t} !s hasQuoted ?: ${msg.hasQuotedMsg}`.magenta)

	let m
	msg.hasQuotedMsg ? (m = await msg.getQuotedMessage()) : (m = msg)

	let media = MessageMedia.fromFilePath(audioPath)
	log(`${t} Media type: ${media.mimetype}. Sending...`.cyan)

	let reply = await m.reply(media)
	log(`${t} Replied w/ bruh ?: ${reply.hasMedia}`.cyan)
}

// ----------------------------------
