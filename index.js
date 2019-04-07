const telegraf = require('telegraf');
const Stage = require('telegraf/stage');
const { leave } = Stage;
const stage = new Stage();
const scene = require('telegraf/scenes/base');
const session = require('telegraf-session-local');
const config = require('./config');
const log = require('./log');
const scenes = require('./scenes/sceneHandler');

log.info("Starting bot")

const bot = new telegraf(config.get("telegram:botToken"));
config.set("bot:bot", bot);
bot.use((new session({database: 'config/db.json'})).middleware());

stage.command('cancel', leave());
bot.use(stage.middleware());

scenes(scene, stage, bot);

bot.catch((err) => {
    log.error("Telegraf error occurred", err)
})

bot.launch();